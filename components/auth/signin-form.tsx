"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "./auth-provider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { IconMail, IconLock } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirectTo") || "/";
  const { signIn } = useAuth();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error, data } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data?.user) {
        // Check if onboarding is completed
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }
          
        if (!profile || !profile.onboarding_completed) {
          router.push('/onboarding');
        } else {
          router.push(redirectPath);
        }
      } else {
        router.push(redirectPath);
      }
    } catch (err: unknown) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      // If there's an authentication error, let's offer to reset cookies
      if (err instanceof Error && (
        err.message.includes('cookie') || 
        err.message.includes('token') || 
        err.message.includes('session') || 
        err.message.includes('auth')
      )) {
        setError(`${err.message}. There might be an issue with your login data. Try resetting cookies or clearing browser data.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetCookies = () => {
    // Navigate to the cookie reset route which will clear auth cookies
    window.location.href = '/auth/reset-cookies';
  };

  return (
    <Card className="w-full border-none shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-emerald-500">
                <IconMail size={16} />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <a href="/auth/forgot-password" className="text-xs text-emerald-600 hover:text-emerald-500">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-3 text-emerald-500">
                <IconLock size={16} />
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>
          </div>
          {error && (
            <div className="text-sm p-3 bg-red-50 text-red-500 rounded-md">
              {error}
              {error.toLowerCase().includes('cookie') || error.toLowerCase().includes('session') ? (
                <div className="mt-2">
                  <button 
                    type="button"
                    onClick={handleResetCookies}
                    className="text-xs font-medium text-red-600 hover:text-red-800 underline"
                  >
                    Reset authentication cookies
                  </button>
                </div>
              ) : null}
            </div>
          )}
          <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a href={`/auth/signup${redirectPath !== "/" ? `?redirect=${redirectPath}` : ""}`} className="text-emerald-600 font-medium hover:text-emerald-500">
            Sign Up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
} 
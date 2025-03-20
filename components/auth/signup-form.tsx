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
import { useToast } from "../ui/use-toast";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const { signUp, signIn } = useAuth();
  const supabase = createClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (existingUser) {
        setError("A user with this email already exists. Please sign in instead.");
        setLoading(false);
        return;
      }

      // Register the user
      const { error: signUpError, data } = await signUp(email, password);
      
      if (signUpError) {
        // If error message contains "already registered", it's an existing user
        if (signUpError.message.includes("already registered") || 
            signUpError.message.includes("already in use") ||
            signUpError.message.includes("already exists")) {
          
          toast({
            title: "Account exists",
            description: "This email is already registered. Trying to sign in instead.",
            variant: "default"
          });
          
          // Try to sign in instead
          const { error: signInError } = await signIn(email, password);
          if (signInError) {
            setError(`This email is already registered. ${signInError.message}`);
            return;
          } else {
            // Sign in successful, redirect to onboarding
            router.push('/onboarding');
            return;
          }
        } else {
          setError(signUpError.message);
          return;
        }
      }
      
      if (data?.user) {
        try {
          // Check if onboarding is completed
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', data.user.id)
            .single();
            
          if (profileError) {
            console.error("Error fetching profile after signup:", profileError);
            // Even with error, we continue to onboarding
          }
            
          // Route to onboarding
          router.push('/onboarding');
        } catch (profileErr) {
          console.error("Error in profile check:", profileErr);
          // Even with error, we continue to onboarding
          router.push('/onboarding');
        }
      } else {
        // Fallback in case user data isn't available
        toast({
          title: "Account created",
          description: "Please check your email to confirm your account.",
          variant: "default"
        });
        router.push('/auth/confirm');
      }
    } catch (err: unknown) {
      console.error("Signup error:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      // If there's an authentication error, let's offer to reset cookies
      if (err instanceof Error && (
        err.message.includes('cookie') || 
        err.message.includes('token') || 
        err.message.includes('session') || 
        err.message.includes('auth')
      )) {
        setError(`${err.message}. There might be an issue with your authentication data. Try resetting cookies.`);
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
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>
          Enter your details to create your account
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
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-emerald-500">
                <IconLock size={16} />
              </div>
              <Input
                id="password"
                type="password"
                className="pl-9 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <a href={`/auth/signin${redirectPath !== "/" ? `?redirectTo=${redirectPath}` : ""}`} className="text-emerald-600 font-medium hover:text-emerald-500">
            Sign In
          </a>
        </p>
      </CardFooter>
    </Card>
  );
} 
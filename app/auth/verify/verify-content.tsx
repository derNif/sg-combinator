"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center">
          <CheckCircle className="h-12 w-12 text-emerald-500" />
        </div>
        <CardTitle className="text-2xl">Check your email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification link to {email || "your email address"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 text-center space-y-6">
        <p className="text-gray-600">
          Please click the link in your email to verify your account and complete setup.
        </p>
        <p className="text-sm text-gray-500">
          If you don&apos;t see the email in your inbox, please check your spam folder.
        </p>
        <div className="flex flex-col gap-2">
          <Button variant="outline" asChild>
            <a href="/auth/signin">Back to Sign In</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
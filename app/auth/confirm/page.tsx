"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconMailCheck } from "@tabler/icons-react";

export default function ConfirmPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] py-12">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <IconMailCheck className="h-10 w-10 text-emerald-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent a confirmation link to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-gray-600">
              Please check your inbox and click on the confirmation link to activate your account.
              If you don't see the email, check your spam folder.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600">
              <Link href="/auth/signin">
                Return to Sign In
              </Link>
            </Button>
            <p className="text-xs text-gray-500 text-center">
              If you haven't received the email after a few minutes,
              try signing in with the email and password you provided.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 
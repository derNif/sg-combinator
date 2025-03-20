import { SignInForm } from "@/components/auth/signin-form";
import Image from "next/image";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
            <Image src="/logo.svg" alt="SG Combinator Logo" width={12} height={12} />
          </div>
          <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to continue to SG Combinator</p>
        </div>
        <Suspense fallback={
          <div className="w-full h-[400px] rounded-lg bg-gray-100 animate-pulse" />
        }>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
} 
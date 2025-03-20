"use client";

import { SignUpForm } from "@/components/auth/signup-form";
import Image from "next/image";

export default function SignUpContent() {
  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
          <Image src="/logo.svg" alt="SG Combinator Logo" width={12} height={12} />
        </div>
        <h1 className="text-3xl font-bold text-center">Join SG Combinator</h1>
        <p className="text-gray-500 mt-2">Create an account to get started</p>
      </div>
      <SignUpForm />
    </>
  );
} 
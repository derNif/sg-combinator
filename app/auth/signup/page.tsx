import { SignUpForm } from "@/components/auth/signup-form";
import { IconLeaf } from "@tabler/icons-react";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <IconLeaf size={24} stroke={2} />
          </div>
          <h1 className="text-3xl font-bold text-center">Join SG Combinator</h1>
          <p className="text-gray-500 mt-2">Create an account to get started</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
} 
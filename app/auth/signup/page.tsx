import { Suspense } from "react";
import SignUpContent from "./signup-content";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={
          <div className="w-full h-[400px] rounded-lg bg-gray-100 animate-pulse" />
        }>
          <SignUpContent />
        </Suspense>
      </div>
    </div>
  );
} 
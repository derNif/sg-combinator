import { Suspense } from "react";
import VerifyContent from "./verify-content";

export default function VerifyPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={
          <div className="w-full h-[300px] rounded-lg bg-gray-100 animate-pulse" />
        }>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
} 
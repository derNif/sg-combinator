"use client"

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FounderMatchingChatbot, FounderDirectory } from "./components";

export default function FounderMatchingPage() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Use effect to check localStorage after component mounts
  useEffect(() => {
    setIsClient(true);
    const completed = localStorage.getItem("founderMatchingOnboardingCompleted");
    setHasCompletedOnboarding(!!completed);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("founderMatchingOnboardingCompleted", "true");
    setHasCompletedOnboarding(true);
  };

  // Show loading state until client-side code executes
  if (!isClient) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Founder Matching</h1>
        <p className="text-lg mb-8">
          Find the perfect founder for your project based on skills, experience, and vision alignment.
        </p>
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
          {/* Empty shell that matches layout */}
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Founder Matching Assistant</h2>
              <p className="text-gray-600">Answer a few questions to find your ideal co-founder</p>
            </div>
            <div className="h-[400px]"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Founder Matching</h1>
      <p className="text-lg mb-8">
        Find the perfect founder for your project based on skills, experience, and vision alignment.
      </p>

      {!hasCompletedOnboarding ? (
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
          <FounderMatchingChatbot onComplete={completeOnboarding} />
        </Card>
      ) : (
        <FounderDirectory />
      )}
    </div>
  );
} 
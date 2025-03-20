"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import BasicInfoStep from "./steps/BasicInfoStep";
import StartupInfoStep from "./steps/StartupInfoStep";
import SkillsAndExperienceStep from "./steps/SkillsAndExperienceStep";
import GoalsStep from "./steps/GoalsStep";
import CompletionStep from "./steps/CompletionStep";

export type OnboardingData = {
  userId: string;
  full_name?: string;
  primary_goal?: string;
  objectives?: string[];
  startup_name?: string;
  industry?: string;
  stage?: string;
  description?: string;
  skills?: string[];
  experience?: string;
};

interface OnboardingFlowProps {
  userId: string;
  userEmail?: string;
  initialUserData?: Partial<OnboardingData>;
}

export default function OnboardingFlow({ userId, userEmail, initialUserData }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<OnboardingData>({
    userId,
    full_name: initialUserData?.full_name || "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const totalSteps = 4; // Excluding completion step

  const handleStepSubmit = (data: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    goToNextStep();
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resetCookiesAndRetry = async () => {
    // Clear auth cookies and redirect to sign in
    window.location.href = '/auth/reset-cookies?redirectTo=/auth/signin';
  };

  const saveDataToDatabase = async () => {
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: 'include' // Important to include cookies for auth
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Failed to save onboarding data";
        console.error("Error response from API:", data);
        setApiError(errorMessage);
        
        if (response.status === 401) {
          toast({
            title: "Authentication error",
            description: "Your session has expired. Please sign in again.",
            variant: "destructive",
          });
          setTimeout(() => {
            resetCookiesAndRetry();
          }, 2000);
          return false;
        }
        
        toast({
          title: "Failed to save",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Onboarding complete!",
        description: "Your profile has been updated successfully.",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      const errorMessage = error instanceof Error ? error.message : "Network error";
      setApiError(errorMessage);
      
      toast({
        title: "Connection error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeOnboarding = async () => {
    const success = await saveDataToDatabase();
    if (success) {
      // If admin, stay on the page. If user, redirect to home
      if (userEmail === "admin@sgcombinator.com") {
        setCurrentStep(0);
        setFormData({ userId });
        toast({
          title: "Admin mode",
          description: "Staying on onboarding page for admin testing.",
        });
      } else {
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep 
            onSubmit={handleStepSubmit} 
            initialData={formData} 
          />
        );
      case 1:
        return (
          <StartupInfoStep 
            onSubmit={handleStepSubmit} 
            onBack={goToPreviousStep} 
            initialData={formData} 
          />
        );
      case 2:
        return (
          <SkillsAndExperienceStep 
            onSubmit={handleStepSubmit} 
            onBack={goToPreviousStep} 
            initialData={formData} 
          />
        );
      case 3:
        return (
          <GoalsStep 
            onSubmit={handleStepSubmit} 
            onBack={goToPreviousStep} 
            initialData={formData} 
          />
        );
      case 4:
        return (
          <CompletionStep 
            onComplete={completeOnboarding} 
            onBack={goToPreviousStep} 
            isSubmitting={isSubmitting} 
            userData={formData}
            apiError={apiError}
            onResetCookies={resetCookiesAndRetry}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      
      <Card className="p-6 shadow-lg mt-6">
        {renderStep()}
      </Card>
    </div>
  );
}

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {Array.from({ length: totalSteps + 1 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm",
              currentStep === index
                ? "bg-emerald-500 text-white"
                : currentStep > index
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {index + 1}
          </div>
          <div className="text-xs mt-2 text-gray-600">
            {index === 0 && "Basic Info"}
            {index === 1 && "Startup"}
            {index === 2 && "Skills"}
            {index === 3 && "Goals"}
            {index === 4 && "Complete"}
          </div>
        </div>
      ))}
    </div>
  );
} 
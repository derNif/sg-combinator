"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingData } from "../OnboardingFlow";

interface BasicInfoStepProps {
  onSubmit: (data: Partial<OnboardingData>) => void;
  initialData?: OnboardingData;
}

export default function BasicInfoStep({ onSubmit, initialData }: BasicInfoStepProps) {
  const [fullName, setFullName] = useState<string>(initialData?.full_name || "");
  const [nameError, setNameError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate full name
    if (!fullName.trim()) {
      setNameError("Please enter your full name");
      return;
    }
    
    // Clear any errors
    setNameError("");
    
    // Submit the data
    onSubmit({
      full_name: fullName,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
        <p className="text-gray-600">Let&apos;s start with some basic information about you.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={nameError ? "border-red-500" : ""}
          />
          {nameError && <p className="text-sm text-red-500">{nameError}</p>}
        </div>
        
        <div className="pt-4">
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
} 
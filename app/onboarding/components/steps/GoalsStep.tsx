"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData } from "../OnboardingFlow";

interface GoalsStepProps {
  onSubmit: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  initialData?: OnboardingData;
}

export default function GoalsStep({ onSubmit, onBack, initialData }: GoalsStepProps) {
  const [primaryGoal, setPrimaryGoal] = useState<string>(initialData?.primary_goal || "");
  const [objectives, setObjectives] = useState<string[]>(initialData?.objectives || []);
  const [primaryGoalError, setPrimaryGoalError] = useState<string>("");

  const handleObjectiveToggle = (objective: string) => {
    setObjectives((current) => 
      current.includes(objective)
        ? current.filter((o) => o !== objective)
        : [...current, objective]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate primary goal
    if (!primaryGoal) {
      setPrimaryGoalError("Please select your primary goal");
      return;
    }
    
    // Clear any errors
    setPrimaryGoalError("");
    
    onSubmit({
      primary_goal: primaryGoal,
      objectives,
    });
  };

  const goals = [
    {
      value: "found-startup",
      label: "Found a startup",
      description: "I want to start my own company"
    },
    {
      value: "join-startup", 
      label: "Join a startup",
      description: "I want to work at an existing startup"
    },
    {
      value: "find-cofounder",
      label: "Find a co-founder",
      description: "I&apos;m looking for partners to start something with"
    },
    {
      value: "grow-business", 
      label: "Grow my business",
      description: "I already have a startup and want to scale it"
    },
    {
      value: "learn", 
      label: "Learn about startups",
      description: "I want to gain knowledge and skills"
    }
  ];

  const objectiveOptions = [
    {
      id: "funding",
      label: "Raise funding",
    },
    {
      id: "network",
      label: "Build my professional network",
    },
    {
      id: "skills",
      label: "Develop new skills",
    },
    {
      id: "users",
      label: "Get users/customers",
    },
    {
      id: "mentorship",
      label: "Get mentorship",
    },
    {
      id: "job",
      label: "Find a job at a startup",
    },
    {
      id: "knowledge",
      label: "Gain startup knowledge",
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Goals</h2>
        <p className="text-gray-600">Tell us what you&apos;re looking to achieve.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryGoal">What is your primary goal?</Label>
            <div className={primaryGoalError ? "border border-red-500 rounded-md p-2" : ""}>
              <RadioGroup 
                value={primaryGoal} 
                onValueChange={setPrimaryGoal}
                className="space-y-2"
              >
                {goals.map((goal) => (
                  <div key={goal.value} className="flex items-start space-x-2 border p-3 rounded-md hover:bg-gray-50">
                    <RadioGroupItem value={goal.value} id={goal.value} className="mt-1" />
                    <div>
                      <Label htmlFor={goal.value} className="font-medium">{goal.label}</Label>
                      <p className="text-sm text-gray-500">{goal.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              {primaryGoalError && <p className="text-sm text-red-500 mt-2">{primaryGoalError}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>What are your specific objectives? (Select all that apply)</Label>
            <div className="space-y-2">
              {objectiveOptions.map((option) => (
                <div 
                  key={option.id} 
                  className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50"
                >
                  <Checkbox 
                    id={option.id} 
                    checked={objectives.includes(option.id)}
                    onCheckedChange={() => handleObjectiveToggle(option.id)}
                  />
                  <Label htmlFor={option.id} className="font-medium cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
} 
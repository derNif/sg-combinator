"use client";

import { Button } from "@/components/ui/button";
import { OnboardingData } from "../OnboardingFlow";
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface CompletionStepProps {
  onComplete: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  userData: OnboardingData;
  apiError?: string | null;
  onResetCookies?: () => void;
}

export default function CompletionStep({ 
  onComplete, 
  onBack, 
  isSubmitting,
  userData,
  apiError,
  onResetCookies
}: CompletionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          {apiError ? (
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          ) : (
            <CheckCircle className="h-12 w-12 text-emerald-500" />
          )}
        </div>
        <h2 className="text-2xl font-bold">
          {apiError ? "Something Went Wrong" : "Almost Done!"}
        </h2>
        <p className="text-gray-600">
          {apiError 
            ? "We encountered an error while saving your profile." 
            : "Review your information before finalizing your profile."}
        </p>
        
        {apiError && (
          <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
            <p className="font-medium">Error details:</p>
            <p className="mt-1">{apiError}</p>
            
            {apiError.toLowerCase().includes('auth') || 
             apiError.toLowerCase().includes('session') || 
             apiError.toLowerCase().includes('cookie') ? (
              <div className="mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={onResetCookies}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Authentication
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
      
      <div className="space-y-4 mt-6">
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-medium">Personal Information</h3>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <span className="text-sm text-gray-500">Full Name:</span>
              <p>{userData.full_name || "Not provided"}</p>
            </div>
          </div>
        </div>
        
        {userData.startup_name && (
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-medium">Startup Information</h3>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="text-sm text-gray-500">Startup Name:</span>
                <p>{userData.startup_name}</p>
              </div>
              {userData.industry && (
                <div>
                  <span className="text-sm text-gray-500">Industry:</span>
                  <p>{userData.industry}</p>
                </div>
              )}
              {userData.stage && (
                <div>
                  <span className="text-sm text-gray-500">Stage:</span>
                  <p>{userData.stage}</p>
                </div>
              )}
              {userData.description && (
                <div>
                  <span className="text-sm text-gray-500">Description:</span>
                  <p className="text-sm">{userData.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-medium">Skills & Experience</h3>
          <div className="grid grid-cols-1 gap-2">
            {userData.skills && userData.skills.length > 0 ? (
              <div>
                <span className="text-sm text-gray-500">Skills:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userData.skills.map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <span className="text-sm text-gray-500">Skills:</span>
                <p>None provided</p>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-500">Experience:</span>
              <p className="text-sm">{userData.experience || "Not provided"}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-medium">Goals</h3>
          <div className="grid grid-cols-1 gap-2">
            {userData.primary_goal && (
              <div>
                <span className="text-sm text-gray-500">Primary Goal:</span>
                <p>{getGoalLabel(userData.primary_goal)}</p>
              </div>
            )}
            {userData.objectives && userData.objectives.length > 0 ? (
              <div>
                <span className="text-sm text-gray-500">Objectives:</span>
                <ul className="list-disc list-inside text-sm ml-2 mt-1">
                  {userData.objectives.map((objective) => (
                    <li key={objective}>{getObjectiveLabel(objective)}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <span className="text-sm text-gray-500">Objectives:</span>
                <p>None selected</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button 
          onClick={onComplete} 
          disabled={isSubmitting}
          className={apiError ? "bg-amber-500 hover:bg-amber-600" : ""}
        >
          {isSubmitting 
            ? "Saving..." 
            : apiError 
              ? "Try Again" 
              : "Complete Profile"}
        </Button>
      </div>
    </div>
  );
}

function getGoalLabel(goalValue: string): string {
  const goals: Record<string, string> = {
    "found-startup": "Found a startup",
    "join-startup": "Join a startup",
    "find-cofounder": "Find a co-founder",
    "grow-business": "Grow my business",
    "learn": "Learn about startups"
  };
  
  return goals[goalValue] || goalValue;
}

function getObjectiveLabel(objectiveId: string): string {
  const objectives: Record<string, string> = {
    "funding": "Raise funding",
    "network": "Build my professional network",
    "skills": "Develop new skills",
    "users": "Get users/customers",
    "mentorship": "Get mentorship",
    "job": "Find a job at a startup",
    "knowledge": "Gain startup knowledge"
  };
  
  return objectives[objectiveId] || objectiveId;
} 
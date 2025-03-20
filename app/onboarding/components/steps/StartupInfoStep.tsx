"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OnboardingData } from "../OnboardingFlow";

interface StartupInfoStepProps {
  onSubmit: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  initialData?: OnboardingData;
}

export default function StartupInfoStep({ onSubmit, onBack, initialData }: StartupInfoStepProps) {
  const [hasStartup, setHasStartup] = useState<boolean>(!!initialData?.startup_name);
  const [startupName, setStartupName] = useState<string>(initialData?.startup_name || "");
  const [industry, setIndustry] = useState<string>(initialData?.industry || "");
  const [stage, setStage] = useState<string>(initialData?.stage || "");
  const [description, setDescription] = useState<string>(initialData?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasStartup) {
      onSubmit({
        startup_name: startupName,
        industry,
        stage,
        description,
      });
    } else {
      // If user doesn't have a startup, just continue
      onSubmit({});
    }
  };

  const industries = [
    "SaaS",
    "Fintech",
    "Healthcare",
    "E-commerce",
    "Edtech",
    "AI/ML",
    "Blockchain",
    "Consumer",
    "Enterprise",
    "Hardware",
    "Other"
  ];

  const stages = [
    "Idea stage",
    "Pre-seed",
    "Seed",
    "Series A",
    "Series B+",
    "Profitable",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Startup</h2>
        <p className="text-gray-600">Tell us about your startup or business idea.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Do you have a startup or business idea?</Label>
            <RadioGroup 
              value={hasStartup ? "yes" : "no"} 
              onValueChange={(value) => setHasStartup(value === "yes")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="has-startup-yes" />
                <Label htmlFor="has-startup-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="has-startup-no" />
                <Label htmlFor="has-startup-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          
          {hasStartup && (
            <>
              <div className="space-y-2">
                <Label htmlFor="startupName">Startup Name</Label>
                <Input
                  id="startupName"
                  placeholder="Enter your startup name"
                  value={startupName}
                  onChange={(e) => setStartupName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select value={stage} onValueChange={setStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your startup stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stg) => (
                      <SelectItem key={stg} value={stg}>{stg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Brief Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your startup or idea in a few sentences"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </>
          )}
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
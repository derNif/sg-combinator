"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingData } from "../OnboardingFlow";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface SkillsAndExperienceStepProps {
  onSubmit: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  initialData?: OnboardingData;
}

export default function SkillsAndExperienceStep({ 
  onSubmit, 
  onBack, 
  initialData 
}: SkillsAndExperienceStepProps) {
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [currentSkill, setCurrentSkill] = useState<string>("");
  const [experience, setExperience] = useState<string>(initialData?.experience || "");

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      skills,
      experience,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Skills & Experience</h2>
        <p className="text-gray-600">Share your skills and experience to help us match you with opportunities.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <div className="flex gap-2">
              <Input
                id="skills"
                placeholder="Add a skill (e.g. JavaScript, Marketing, Design)"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button 
                type="button" 
                onClick={handleAddSkill}
                variant="secondary"
              >
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1 py-1.5">
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-gray-500">No skills added yet</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience">Professional Experience</Label>
            <Textarea
              id="experience"
              placeholder="Briefly describe your professional background and expertise"
              value={experience}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setExperience(e.target.value)}
              rows={4}
            />
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
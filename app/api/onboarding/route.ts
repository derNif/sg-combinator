import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Database } from "@/types/supabase";

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error in onboarding API:", sessionError);
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 401 }
      );
    }
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get the onboarding data from request
    const data = await request.json();
    const { userId, ...onboardingData } = data;
    
    // Verify the user ID matches the authenticated user
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    try {
      // Transaction to ensure all data is saved correctly
      const { error: txError } = await supabase.rpc('complete_onboarding', { 
        user_uuid: userId 
      });
      
      if (txError) {
        console.error("Error updating profile onboarding_completed flag:", txError);
        // Continue with other saves even if this fails
      }
      
      // Save basic info to profiles table
      if (onboardingData.full_name) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: onboardingData.full_name,
            onboarding_completed: true,
            onboarding_completed_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        if (profileError) {
          console.error("Error updating profile:", profileError);
          throw new Error("Failed to update profile data");
        }
      }
      
      // Save user preferences and goals
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          primary_goal: onboardingData.primary_goal,
          objectives: onboardingData.objectives
        });
        
      if (prefsError) {
        console.error("Error saving preferences:", prefsError);
        throw new Error("Failed to save preferences");
      }
      
      // If there's startup info, save it
      if (onboardingData.startup_name) {
        const { error: startupError } = await supabase
          .from('startups')
          .upsert({
            user_id: userId,
            name: onboardingData.startup_name,
            industry: onboardingData.industry,
            stage: onboardingData.stage,
            description: onboardingData.description
          });
          
        if (startupError) {
          console.error("Error saving startup info:", startupError);
          throw new Error("Failed to save startup information");
        }
      }
      
      // Save skills and experience
      if (onboardingData.skills && Array.isArray(onboardingData.skills)) {
        // First delete any existing skills
        const { error: deleteSkillsError } = await supabase
          .from('user_skills')
          .delete()
          .eq('user_id', userId);
          
        if (deleteSkillsError) {
          console.error("Error deleting existing skills:", deleteSkillsError);
          // Continue anyway
        }
        
        // Then insert new skills
        for (const skill of onboardingData.skills) {
          if (skill && typeof skill === 'string') {
            const { error: skillError } = await supabase
              .from('user_skills')
              .insert({
                user_id: userId,
                skill: skill
              });
              
            if (skillError) {
              console.error(`Error adding skill ${skill}:`, skillError);
              // Continue with other skills
            }
          }
        }
        
        // Save experience
        if (onboardingData.experience) {
          const { error: expError } = await supabase
            .from('user_experience')
            .upsert({
              user_id: userId,
              description: onboardingData.experience
            });
            
          if (expError) {
            console.error("Error saving experience:", expError);
            throw new Error("Failed to save experience information");
          }
        }
      }
      
      return NextResponse.json(
        { success: true, message: "Onboarding data saved successfully" },
        { status: 200 }
      );
    } catch (dbError) {
      console.error("Database error in onboarding:", dbError);
      return NextResponse.json(
        { error: dbError instanceof Error ? dbError.message : "Database error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import OnboardingFlow from "./components/OnboardingFlow";

export default async function OnboardingPage() {
  const supabase = createServerSupabaseClient();
  
  try {
    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Error getting session in onboarding:", sessionError);
      redirect("/auth/signin?redirectTo=/onboarding");
    }
    
    if (!session) {
      redirect("/auth/signin?redirectTo=/onboarding");
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Error fetching profile in onboarding:", profileError);
    }
    
    // Forward user data to client component
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome to SG Combinator</h1>
          <p className="text-gray-600 mb-8">Complete your profile to get the most out of our platform</p>
          
          <OnboardingFlow 
            userId={session.user.id} 
            userEmail={session.user.email || ''} 
            initialUserData={profile || {}} 
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Unexpected error in onboarding page:", error);
    redirect("/auth/signin?error=onboarding_error");
  }
} 
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FounderMatchingPage() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/founder-matching");
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Founder Matching</h1>
      <p className="text-lg mb-8">
        Find the perfect founder for your startup based on skills, experience, and vision alignment.
      </p>

      <Card className="mb-8 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Your Founder Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">Complete your profile to get matched with potential founders</p>
          <div className="p-8 border rounded-md flex items-center justify-center">
            <p>Profile editor coming soon...</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Potential Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">Explore potential founders based on your profile</p>
          <div className="p-8 border rounded-md flex items-center justify-center">
            <p>Matching algorithm coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
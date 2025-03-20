import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AcademyPage() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/academy");
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Academy</h1>
      <p className="text-lg mb-8">
        Access curated resources, workshops, and mentorship to develop essential startup skills.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Current Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Courses you're currently enrolled in</p>
            <div className="p-8 border rounded-md flex items-center justify-center">
              <p>Course content coming soon...</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Workshops</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Upcoming workshops and events</p>
            <div className="p-8 border rounded-md flex items-center justify-center">
              <p>Workshop schedule coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Resource Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">Browse our collection of startup resources</p>
          <div className="p-8 border rounded-md flex items-center justify-center">
            <p>Resource library coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
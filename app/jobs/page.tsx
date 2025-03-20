import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function JobsPage() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/jobs");
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
      <p className="text-lg mb-8">
        Find talent or opportunities at startups in St. Gallen.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Available Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Browse current job openings</p>
            <div className="p-8 border rounded-md flex items-center justify-center">
              <p>Job listings coming soon...</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Track your job applications</p>
            <div className="p-8 border rounded-md flex items-center justify-center">
              <p>Application tracker coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post a Job</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Create a new job listing for your startup</p>
          <div className="p-8 border rounded-md flex items-center justify-center">
            <p>Job posting form coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
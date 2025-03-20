import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AIConsultantPage() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/ai-consultant");
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">AI Consultant</h1>
      <p className="text-lg mb-8">
        Get AI-powered advice for your startup challenges.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Ask Your Question</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Get personalized advice from our AI consultant</p>
              <div className="p-8 border rounded-md h-80 flex items-center justify-center">
                <p>AI chat interface coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Suggested Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-2 bg-muted rounded-md">Business model validation</li>
                <li className="p-2 bg-muted rounded-md">Market research strategies</li>
                <li className="p-2 bg-muted rounded-md">Fundraising advice</li>
                <li className="p-2 bg-muted rounded-md">Product development</li>
                <li className="p-2 bg-muted rounded-md">Team building</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Previous Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Your conversation history</p>
              <div className="p-4 border rounded-md flex items-center justify-center">
                <p>No previous conversations</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
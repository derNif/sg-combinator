import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileBadges } from "@/components/ProfileBadge";
import { 
  IconUserCircle, 
  IconMail, 
  IconLock, 
  IconLogout, 
  IconSettings, 
  IconBell 
} from "@tabler/icons-react";

export default async function ProfilePage() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/profile");
  }

  const user = session.user;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Profile Header */}
          <div className="w-full md:w-1/3">
            <Card className="bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
              <CardHeader className="items-center text-center border-b pb-6">
                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <IconUserCircle className="w-14 h-14 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">{user.email?.split('@')[0] || "User"}</CardTitle>
                <CardDescription className="text-gray-500">{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <ProfileMenuItem icon={<IconMail size={18} />} label="Account Settings" active />
                  <ProfileMenuItem icon={<IconBell size={18} />} label="Notifications" />
                  <ProfileMenuItem icon={<IconSettings size={18} />} label="Preferences" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <form action="/auth/signout" method="post">
                  <Button 
                    type="submit" 
                    variant="outline" 
                    className="text-gray-700 hover:text-red-600 hover:border-red-200 flex items-center gap-2"
                  >
                    <IconLogout size={18} />
                    Sign Out
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>
          
          {/* Account Settings */}
          <div className="w-full md:w-2/3">
            <Card className="bg-white/80 backdrop-blur-sm shadow-sm">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account information and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2 flex items-center gap-2">
                    <IconMail size={18} className="text-emerald-600" />
                    Email Address
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {user.email_confirmed_at 
                      ? "Your email has been verified." 
                      : "Please verify your email address."}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2 flex items-center gap-2">
                    <IconLock size={18} className="text-emerald-600" />
                    Password
                  </h3>
                  <p className="text-sm text-gray-500">
                    Last changed: {user.updated_at 
                      ? new Date(user.updated_at).toLocaleDateString() 
                      : "Never"}
                  </p>

                  <Button 
                    variant="outline" 
                    className="mt-2 text-sm"
                  >
                    Change Password
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Account Created</h3>
                  <p className="text-gray-600">
                    {user.created_at 
                      ? new Date(user.created_at).toLocaleDateString() 
                      : "Unknown"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card className="bg-white/80 backdrop-blur-sm shadow-sm">
                <CardHeader>
                  <CardTitle>Coming Soon</CardTitle>
                  <CardDescription>More profile features will be added in future updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We're working on adding more profile management features like bio information, 
                    profile picture uploads, and integration with the SG Combinator platform.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function ProfileMenuItem({ 
  icon, 
  label, 
  active = false 
}: { 
  icon: React.ReactNode; 
  label: string;
  active?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer ${
      active 
        ? "bg-emerald-50 text-emerald-700" 
        : "text-gray-600 hover:bg-gray-50"
    }`}>
      <div className={`${active ? "text-emerald-600" : "text-gray-500"}`}>
        {icon}
      </div>
      <span className={active ? "font-medium" : ""}>{label}</span>
    </div>
  );
} 
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconUserCircle,
  IconMail,
  IconLock,
  IconLogout,
  IconSettings,
  IconBell
} from "@tabler/icons-react";
import LogoutButton from "./components/LogoutButton";

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
        <div className="flex flex-col md:flex-row gap-8 min-h-screen">
          {/* Profile Header */}
          <div className="w-full md:w-1/3 sticky top-8 self-start h-fit max-h-screen">
            <Card className="bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col h-full sticky top-8">
              <CardHeader className="items-center text-center border-b pb-6">
                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <IconUserCircle className="w-14 h-14 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">{user.email?.split('@')[0] || "User"}</CardTitle>
                <CardDescription className="text-gray-500">{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 flex-grow">
                <div className="space-y-2">
                  <ProfileMenuItem icon={<IconMail size={18} />} label="Account Settings" active />
                  <ProfileMenuItem icon={<IconBell size={18} />} label="Notifications" />
                  <ProfileMenuItem icon={<IconSettings size={18} />} label="Preferences" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4 mt-auto">
                <LogoutButton />
              </CardFooter>
            </Card>
          </div>
          
          {/* Account Settings and Gamification Section */}
          <div className="w-full md:w-2/3 flex flex-col">
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
            
            {/* Gamification Section */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-sm mt-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">Achievements</CardTitle>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">Tech Passionate</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Founder</span>
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">Experienced</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-emerald-100 rounded-md p-2">
                        <IconBell className="h-5 w-5 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-medium">Experience</h3>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-emerald-600">14,921</span>
                        <span className="text-sm text-emerald-700 font-medium">+120 this week</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Current level: 32</span>
                        <span>Next level: 15,000 XP</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 rounded-md p-2">
                        <IconUserCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium">Next Milestones</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>Earn 500 more points for gold badge</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>Answer 5 more questions this week</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>Receive 10 more contribution upvotes</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-amber-100 rounded-md p-2">
                      <IconSettings className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-medium">Earned Badges</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-6">
                      {/* Fast Answerer Medal */}
                      <div className="flex flex-col items-center">
                        <div className="relative mb-1">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 text-white font-bold border-2 border-yellow-600 shadow-md">
                            <span>3</span>
                          </div>
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-2 bg-red-600 rounded-sm"></div>
                        </div>
                        <span className="text-xs font-medium">Fast Answerer</span>
                      </div>
                      
                      {/* Tech Specialist Medal */}
                      <div className="flex flex-col items-center">
                        <div className="relative mb-1">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold border-2 border-gray-500 shadow-md">
                            <span>7</span>
                          </div>
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-2 bg-red-600 rounded-sm"></div>
                        </div>
                        <span className="text-xs font-medium">Tech Specialist</span>
                      </div>
                      
                      {/* Community Helper Medal */}
                      <div className="flex flex-col items-center">
                        <div className="relative mb-1">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-500 text-white font-bold border-2 border-amber-600 shadow-md">
                            <span>12</span>
                          </div>
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-2 bg-red-600 rounded-sm"></div>
                        </div>
                        <span className="text-xs font-medium">Community Helper</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      View All Badges
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
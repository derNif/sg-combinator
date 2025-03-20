"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { IconLogout } from "@tabler/icons-react";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSignOut}
      disabled={isLoading}
      variant="outline" 
      className="text-gray-700 hover:text-red-600 hover:border-red-200 flex items-center gap-2 w-full"
    >
      <IconLogout size={18} />
      {isLoading ? "Signing out..." : "Sign Out"}
    </Button>
  );
} 
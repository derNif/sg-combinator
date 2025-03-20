"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Session, User, AuthError } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    try {
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          try {
            // When session changes, validate with getUser() for security
            if (newSession) {
              const { data: { user: validatedUser }, error } = await supabase.auth.getUser();
              if (!error && validatedUser) {
                setUser(validatedUser);
                setSession(newSession);
              } else if (error) {
                console.error("Error validating user:", error);
                setUser(null);
                setSession(null);
              }
            } else {
              setUser(null);
              setSession(null);
            }
            setLoading(false);
          } catch (e) {
            console.error("Error in auth state change handler:", e);
            setLoading(false);
          }
        }
      );

      // Get initial session
      const getInitialSession = async () => {
        try {
          // Get session from storage
          const { data: { session: initialSession }, error: sessionError } = 
            await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("Error getting initial session:", sessionError);
            setLoading(false);
            return;
          }
          
          // Validate the user with getUser for security
          if (initialSession) {
            const { data: { user: validatedUser }, error: userError } = 
              await supabase.auth.getUser();
            
            if (userError) {
              console.error("Error validating initial user:", userError);
              setUser(null);
              setSession(null);
            } else if (validatedUser) {
              setUser(validatedUser);
              setSession(initialSession);
            }
          }
        } catch (e) {
          console.error("Unexpected error getting initial session:", e);
        } finally {
          setLoading(false);
        }
      };

      getInitialSession();

      return () => {
        subscription.unsubscribe();
      };
    } catch (e) {
      console.error("Error in auth provider setup:", e);
      setLoading(false);
    }
  }, [supabase.auth]);

  const signUp = async (email: string, password: string) => {
    try {
      return await supabase.auth.signUp({
        email,
        password,
      });
    } catch (e) {
      console.error("Error in sign up:", e);
      return {
        error: new AuthError("An unexpected error occurred during sign up"),
        data: null
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      return await supabase.auth.signInWithPassword({
        email,
        password,
      });
    } catch (e) {
      console.error("Error in sign in:", e);
      return {
        error: new AuthError("An unexpected error occurred during sign in"),
        data: null
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // After sign-out, refresh the page to clear any stale state
      window.location.href = '/';
    } catch (e) {
      console.error("Error signing out:", e);
      throw e;
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createServerSupabaseClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          try {
            const cookie = cookieStore.get(name);
            return cookie?.value;
          } catch (error) {
            console.error(`Error getting cookie ${name}:`, error);
            return undefined;
          }
        },
        async set(name: string, value: string, options: { path: string; maxAge: number; sameSite: string }) {
          try {
            cookieStore.set({ 
              name, 
              value, 
              ...options, 
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production' 
            });
          } catch (error) {
            console.error('Error setting cookie:', error);
          }
        },
        async remove(name: string, options: { path: string }) {
          try {
            cookieStore.set({ 
              name, 
              value: '', 
              ...options, 
              maxAge: 0,
              httpOnly: true 
            });
          } catch (error) {
            console.error('Error removing cookie:', error);
          }
        },
      },
    }
  )
} 
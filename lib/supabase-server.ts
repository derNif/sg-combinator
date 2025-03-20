import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createServerSupabaseClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          // @ts-ignore - cookies() get method exists even though TypeScript doesn't recognize it
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set(name, value, options) {
          // @ts-ignore - cookies() set method exists even though TypeScript doesn't recognize it
          cookieStore.set(name, value, options)
        },
        remove(name, options) {
          // @ts-ignore - cookies() set method exists even though TypeScript doesn't recognize it
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )
} 
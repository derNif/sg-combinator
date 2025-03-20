import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';

// Paths that require authentication
const PROTECTED_PATHS = [
  '/founder-matching',
  '/academy',
  '/ai-consultant',
  '/profile',
  '/onboarding'
];

// Paths that require completed onboarding
const ONBOARDING_REQUIRED_PATHS = [
  '/founder-matching',
  '/academy',
  '/ai-consultant',
  '/profile',
];

// Paths that are excluded from onboarding redirect
const ONBOARDING_EXCLUDED_PATHS = [
  '/onboarding',
  '/api',
  '/auth',
  '/_next',
  '/favicon.ico',
  '/.well-known',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  const hostname = req.headers.get('host') || '';
  const isLocalhost = hostname.includes('localhost');
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({
            name,
            value,
            ...options,
            httpOnly: true,
            secure: !isLocalhost,
            sameSite: 'lax',
            path: '/',
            domain: isLocalhost ? undefined : hostname.split(':')[0]
          });
        },
        remove(name, options) {
          res.cookies.set({
            name,
            value: '',
            ...options,
            httpOnly: true,
            secure: !isLocalhost,
            sameSite: 'lax',
            path: '/',
            domain: isLocalhost ? undefined : hostname.split(':')[0],
            maxAge: 0
          });
        }
      }
    }
  );
  
  const { pathname } = req.nextUrl;
  
  // Skip middleware for authentication callback routes
  if (pathname.startsWith('/auth/callback') || pathname.startsWith('/auth/reset-cookies')) {
    return res;
  }
  
  // Check if the path is protected
  const isProtectedPath = PROTECTED_PATHS.some(path => 
    pathname.startsWith(path)
  );
  
  // Skip middleware for non-protected paths
  if (!isProtectedPath) {
    return res;
  }
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error checking auth session:', error);
    }

    // Handle protected routes
    if (pathname.startsWith('/protected') && !session) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Check if user needs to complete onboarding
    const shouldCheckOnboarding = session && 
      ONBOARDING_REQUIRED_PATHS.some(path => pathname.startsWith(path)) &&
      !ONBOARDING_EXCLUDED_PATHS.some(path => pathname.startsWith(path));
    
    if (shouldCheckOnboarding) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile in middleware:', profileError);
        }
        
        // If onboarding is not completed, redirect to onboarding
        if (!profile || profile.onboarding_completed !== true) {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    }
  } catch (e) {
    console.error('Error in middleware:', e);
    return res;
  }
  
  return res;
} 
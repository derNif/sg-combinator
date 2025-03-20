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
  
  // Get hostname for cookie settings
  const hostname = req.headers.get('host') || '';
  const isLocalhost = hostname.includes('localhost');
  
  // Create a Supabase client
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          // Modify cookie options based on environment
          const cookieOptions: CookieOptions = {
            ...options,
            httpOnly: true,
            secure: !isLocalhost,
            sameSite: 'lax',
            path: '/'
          };
          
          // Set the domain only in production
          if (!isLocalhost) {
            // Extract the domain from the hostname (remove port if present)
            const domain = hostname.split(':')[0];
            if (!domain.includes('localhost')) {
              cookieOptions.domain = domain;
            }
          }
          
          res.cookies.set({
            name,
            value,
            ...cookieOptions
          });
        },
        remove(name, options) {
          // Modify cookie options based on environment
          const cookieOptions: CookieOptions = {
            ...options,
            maxAge: 0,
            httpOnly: true,
            secure: !isLocalhost,
            sameSite: 'lax',
            path: '/'
          };
          
          // Set the domain only in production
          if (!isLocalhost) {
            // Extract the domain from the hostname (remove port if present)
            const domain = hostname.split(':')[0];
            if (!domain.includes('localhost')) {
              cookieOptions.domain = domain;
            }
          }
          
          res.cookies.set({
            name,
            value: '',
            ...cookieOptions
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
    // Check authentication
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session in middleware:', sessionError);
      const redirectUrl = new URL('/auth/signin', req.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // If there's no session and the path is protected, redirect to login
    if (!session && isProtectedPath) {
      const redirectUrl = new URL('/auth/signin', req.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
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
  } catch (error) {
    console.error('Unexpected error in middleware:', error);
    // On error, allow the request to proceed rather than breaking user experience
  }
  
  return res;
} 
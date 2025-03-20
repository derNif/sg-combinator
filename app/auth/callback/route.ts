import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';
  
  if (code) {
    const cookieStore = cookies();
    
    // Get hostname for cookie settings
    const hostname = req.headers.get('host') || '';
    const isLocalhost = hostname.includes('localhost');
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            // Add production-specific cookie settings
            const cookieOptions = {
              ...options,
              httpOnly: true,
              secure: !isLocalhost,
              path: '/',
              sameSite: 'lax'
            };
            
            // Update domain for production
            if (!isLocalhost) {
              const domain = hostname.split(':')[0];
              if (!domain.includes('localhost')) {
                // @ts-expect-error - domain is valid option
                cookieOptions.domain = domain;
              }
            }
            
            cookieStore.set(name, value, cookieOptions);
          },
          remove(name, options) {
            // Add production-specific cookie settings
            const cookieOptions = {
              ...options,
              httpOnly: true,
              secure: !isLocalhost,
              path: '/',
              sameSite: 'lax',
              maxAge: 0
            };
            
            // Update domain for production
            if (!isLocalhost) {
              const domain = hostname.split(':')[0];
              if (!domain.includes('localhost')) {
                // @ts-expect-error - domain is valid option
                cookieOptions.domain = domain;
              }
            }
            
            cookieStore.set(name, '', cookieOptions);
          },
        },
      }
    );

    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(new URL(`/auth/signin?error=${encodeURIComponent(error.message)}`, req.url));
      }
      
      // Check if user needs to complete onboarding
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        }
        
        // If onboarding is not completed, redirect to onboarding
        if (!profile || profile.onboarding_completed !== true) {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
      }
      
      // Successful authentication, redirect to the requested page
      return NextResponse.redirect(new URL(next, req.url));
    } catch (error) {
      console.error('Unexpected error in auth callback:', error);
      return NextResponse.redirect(new URL(`/auth/signin?error=${encodeURIComponent('An unexpected error occurred')}`, req.url));
    }
  }

  // If no code is present, redirect to the home page
  return NextResponse.redirect(new URL('/', req.url));
} 
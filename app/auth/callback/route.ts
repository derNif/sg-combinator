import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/';

  if (!code) {
    return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin));
  }

  try {
    const supabase = createServerSupabaseClient();
    
    // Exchange the code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      return NextResponse.redirect(new URL('/auth/signin?error=auth_callback_error', requestUrl.origin));
    }
    
    // Get the user's session after authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return NextResponse.redirect(new URL('/auth/signin?error=session_error', requestUrl.origin));
    }
    
    if (session) {
      try {
        // Check if profile exists and if onboarding is completed
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        }
        
        // If no profile or onboarding not completed, redirect to onboarding
        if (!profile || profile.onboarding_completed !== true) {
          const response = NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
          
          // Add additional headers to ensure cookies are properly set
          response.headers.set('Cache-Control', 'no-store, max-age=0');
          
          return response;
        }
      } catch (error) {
        console.error('Error in profile check:', error);
      }
    }

    // If session is obtained but no profile check needed or onboarding is completed
    const response = NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
    
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(new URL('/auth/signin?error=unexpected_error', requestUrl.origin));
  }
} 
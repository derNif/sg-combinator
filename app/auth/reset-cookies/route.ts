import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  
  // Get hostname for cookie settings
  const hostname = req.headers.get('host') || '';
  const isLocalhost = hostname.includes('localhost');
  
  // List of Supabase auth-related cookies
  const supabaseAuthCookies = [
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token',
    '__session',
    'sb-provider-token'
  ];
  
  // Cookie settings that match what's used in middleware and callback
  const cookieOptions = {
    httpOnly: true,
    secure: !isLocalhost,
    path: '/',
    sameSite: 'lax',
    maxAge: 0,
  };
  
  // Add domain for production environments
  if (!isLocalhost) {
    const domain = hostname.split(':')[0];
    if (!domain.includes('localhost')) {
      // @ts-expect-error - domain is valid option
      cookieOptions.domain = domain;
    }
  }
  
  // Clear all potential auth cookies
  for (const cookieName of supabaseAuthCookies) {
    cookieStore.set(cookieName, '', cookieOptions);
  }
  
  // Redirect back to signin page with a message
  return NextResponse.redirect(new URL('/auth/signin?message=cookies_reset', req.url));
} 
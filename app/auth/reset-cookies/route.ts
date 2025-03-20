import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
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
  
  // Create a response
  const response = NextResponse.redirect(new URL('/auth/signin?message=cookies_reset', req.url));
  
  // Clear all potential auth cookies
  for (const cookieName of supabaseAuthCookies) {
    response.cookies.set({
      name: cookieName,
      value: '',
      ...cookieOptions
    });
  }
  
  return response;
} 
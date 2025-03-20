import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const hostname = new URL(req.url).hostname;
  const isLocalhost = hostname.includes('localhost');
  
  const response = NextResponse.redirect(new URL('/auth/signin?message=cookies-reset', req.url));

  // List of Supabase auth-related cookies
  const supabaseAuthCookies = [
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token'
  ];
  
  // Clear all potential auth cookies
  for (const cookieName of supabaseAuthCookies) {
    response.cookies.set({
      name: cookieName,
      value: '',
      path: '/',
      secure: !isLocalhost,
      httpOnly: true,
      sameSite: 'lax',
      domain: isLocalhost ? undefined : hostname,
      maxAge: 0
    });
  }
  
  return response;
} 
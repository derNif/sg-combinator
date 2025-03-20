import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/auth/signin', request.url));

  // Clear all Supabase cookies
  const cookiesToClear = [
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token',
    '_supabase_site_key'
  ];

  cookiesToClear.forEach(name => {
    response.cookies.set({
      name,
      value: '',
      path: '/',
      maxAge: 0,
    });
  });

  return response;
} 
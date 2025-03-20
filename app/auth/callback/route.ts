import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';
  
  if (code) {
    const hostname = req.headers.get('host') || '';
    const isLocalhost = hostname.includes('localhost');
    const cookieStore = new Map<string, { name: string; value: string; options: any }>();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => {
            return req.cookies.get(name)?.value;
          },
          set: (name: string, value: string, options: CookieOptions) => {
            cookieStore.set(name, {
              name,
              value,
              options: {
                ...options,
                httpOnly: true,
                secure: !isLocalhost,
                sameSite: 'lax',
                path: '/',
                domain: isLocalhost ? undefined : hostname.split(':')[0]
              }
            });
          },
          remove: (name: string, options: CookieOptions) => {
            cookieStore.set(name, {
              name,
              value: '',
              options: {
                ...options,
                httpOnly: true,
                secure: !isLocalhost,
                sameSite: 'lax',
                path: '/',
                domain: isLocalhost ? undefined : hostname.split(':')[0],
                maxAge: 0
              }
            });
          }
        }
      }
    );

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        const errorResponse = NextResponse.redirect(new URL(`/auth/signin?error=${encodeURIComponent(error.message)}`, req.url));
        // Apply any cookies that were set during the error handling
        for (const cookie of cookieStore.values()) {
          errorResponse.cookies.set(cookie.name, cookie.value, cookie.options);
        }
        return errorResponse;
      }

      const response = NextResponse.redirect(new URL(next, req.url));
      // Apply all collected cookies to the final response
      for (const cookie of cookieStore.values()) {
        response.cookies.set(cookie.name, cookie.value, cookie.options);
      }
      return response;
    } catch (error) {
      console.error('Unexpected error in auth callback:', error);
      const errorResponse = NextResponse.redirect(new URL('/auth/signin?error=unexpected_error', req.url));
      // Apply any cookies that were set during the error handling
      for (const cookie of cookieStore.values()) {
        errorResponse.cookies.set(cookie.name, cookie.value, cookie.options);
      }
      return errorResponse;
    }
  }

  return NextResponse.redirect(new URL('/', req.url));
} 
import { NextRequest, NextResponse } from 'next/server';

const protectedPrefixes = ['/dashboard'];
const authPages = ['/sign-in', '/sign-up'];

function redirectToSignIn(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/sign-in';
  url.search = '';
  url.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search);
  url.searchParams.set('reason', 'authentication-required');
  return NextResponse.redirect(url);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuth = Boolean(request.cookies.get('auth')?.value);

  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthPage = authPages.includes(pathname);

  // If the server-side dashboard auth check has determined that the cookie is
  // stale/invalid, the dashboard sends the visitor here with clear_session=1.
  // Clear it before rendering the sign-in page so the user cannot get trapped
  // in a dashboard -> sign-in -> dashboard redirect loop.
  if (isAuthPage && request.nextUrl.searchParams.get('clear_session') === '1') {
    const url = request.nextUrl.clone();
    url.searchParams.delete('clear_session');
    url.searchParams.delete('reason');

    const response = NextResponse.redirect(url);
    response.cookies.set({
      name: 'auth',
      value: '',
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return response;
  }

  // Only protect application routes. The presence of an auth cookie is not
  // treated as proof that the session is valid; Laravel remains authoritative.
  if (isProtected && !hasAuth) {
    return redirectToSignIn(request);
  }

  // Do NOT redirect /sign-in or /sign-up merely because an auth cookie exists.
  // A stale cookie must be allowed to reach the auth page, where it can be
  // replaced by a fresh login instead of creating a redirect loop.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
};

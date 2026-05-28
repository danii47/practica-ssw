import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/register'];
const AUTH_PATHS = ['/login', '/register'];

const ADMIN_ONLY = ['/moderation'];
const USER_ONLY = ['/my-services', '/community', '/my-contacts', '/my-exchanges'];

function isUserOnlyPath(pathname: string) {
  if (pathname === '/') return true;
  return USER_ONLY.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isApiAuth = pathname.startsWith('/api/auth');

  if (isApiAuth) return NextResponse.next();

  if (!session && !isPublic) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isAuthPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (session) {
    if (session.role === 'admin' && isUserOnlyPath(pathname)) {
      return NextResponse.redirect(new URL('/moderation', request.url));
    }
    if (session.role !== 'admin' && ADMIN_ONLY.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/resume-builder', '/resume-parser'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Define auth routes (login, register)
  const authRoutes = ['/login', '/register']; // Assuming you have a /register page
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/api/auth/signin', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname); // Optional: redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access an auth route (login/register) with a token, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    // Explicitly include paths if the negative lookahead is too broad or for clarity
    // However, the above regex usually covers common cases well.
    // '/dashboard/:path*',
    // '/resume-builder/:path*',
    // '/resume-parser/:path*',
    // '/login',
    // '/register',
  ],
};

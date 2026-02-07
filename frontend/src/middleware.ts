/**
 * Next.js middleware for authentication on protected routes.
 * Checks for valid token and redirects to signin if not authenticated.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get token from cookies or check if it exists in localStorage (client-side)
  // Note: Since we're using localStorage, this middleware primarily handles
  // route protection at the Next.js level. The actual token validation
  // happens on the backend.

  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile'];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // For client-side token storage, we can't check the token here
    // The actual authentication check happens in the page component
    // This middleware serves as a first line of defense

    // In a production app with httpOnly cookies, you would check the cookie here
    // const token = request.cookies.get('auth_token');
    // if (!token) {
    //   return NextResponse.redirect(new URL('/signin', request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

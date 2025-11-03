import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has session cookie
  const sessionToken = request.cookies.get("authjs.session-token") ||
                      request.cookies.get("__Secure-authjs.session-token");

  const isAuthenticated = !!sessionToken;

  // Public routes (including survey short links)
  const publicRoutes = ["/login", "/signup", "/s/"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Protected routes (dashboard)
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/surveys");

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Root redirect - authenticated users go to dashboard
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Landing page is public - no redirect for unauthenticated users

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

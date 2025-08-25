import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Paths for restricted access
const AUTH_ROUTES = ["/dashboard"];
const ADMIN_ROUTES = ["/admin"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Authenticated user routes
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  // Admin-only routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (!token?.isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Match only protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

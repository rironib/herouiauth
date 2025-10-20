import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/dashboard"];
const ADMIN_ROUTES = ["/admin"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // -----------------------------
  // 🔹 2. Auth Protection
  // -----------------------------
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Authenticated user routes
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return res;
  }

  // Admin-only routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token?.isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return res;
  }

  return res;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

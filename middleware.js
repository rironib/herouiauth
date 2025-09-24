import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { generateVisitorId } from "@/lib/generateVisitorId";

const AUTH_ROUTES = ["/dashboard"];
const ADMIN_ROUTES = ["/admin"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // -----------------------------
  // 🔹 1. Analytics Visitor Tracking
  // -----------------------------
  const cookieName = "visitorId";
  const visitorId = req.cookies.get(cookieName)?.value;

  if (!visitorId) {
    // New visitor
    const newVisitorId = generateVisitorId();

    console.log("New Visitor ID:", newVisitorId);

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/visitor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: newVisitorId,
        ip: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "",
        referrer: req.headers.get("referer") || "",
      }),
    }).catch(console.error);

    res.cookies.set(cookieName, newVisitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  } else {
    // Returning visitor
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/visitor`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    }).catch(console.error);
  }

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
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (!token?.isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return res;
  }

  return res;
}

// Match both protected + analytics routes
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // everything except API/static
  ],
};

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /system-ops/* except /system-ops/login and /system-ops/setup
  if (
    pathname.startsWith("/system-ops") &&
    !pathname.startsWith("/system-ops/login") &&
    !pathname.startsWith("/system-ops/setup")
  ) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/system-ops/login", req.url));
    }
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.redirect(new URL("/system-ops/login", req.url));
    }
  }

  // Trust Cloudflare proxy headers
  const res = NextResponse.next();
  return res;
}

export const config = {
  matcher: ["/system-ops/:path*"],
};

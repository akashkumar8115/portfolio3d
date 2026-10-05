import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/server/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (await readSessionToken(token)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

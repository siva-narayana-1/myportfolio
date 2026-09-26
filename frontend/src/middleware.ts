import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Allow access to dashboard - client-side will handle auth check
  // This prevents middleware from blocking access before localStorage is available
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};

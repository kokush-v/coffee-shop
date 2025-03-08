import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";

import tokenService from "@/src/lib/token";

export default async function middleware(request: NextRequest) {
  const cookie = await cookies();

  if (!cookie.get("access-token")?.value) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/my/orders/manage")) {
    const { data, error } = await tokenService.readToken();

    if (error || (data && !data.is_staff)) {
      return NextResponse.redirect(new URL("/my/orders", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/my/:path*"],
};

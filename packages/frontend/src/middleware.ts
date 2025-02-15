import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";

export default async function middleware(request: NextRequest) {
  const cookie = await cookies();

  if (!cookie.get("access-token")?.value) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/my/:path*"],
};

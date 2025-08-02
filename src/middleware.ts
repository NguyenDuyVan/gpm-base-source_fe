import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_AUTH === "true") {
    return NextResponse.next();
  }

  const authUser = request.cookies.get("authUser");

  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register"
  ) {
    return NextResponse.next();
  }

  if (!authUser) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
};

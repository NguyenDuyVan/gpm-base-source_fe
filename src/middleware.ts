import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Permission } from "./types/api";
import { decodeValueCookie } from "./helpers";

export function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_AUTH === "true") {
    return NextResponse.next();
  }

  const authUser = decodeValueCookie(
    request.cookies.get("authUser")?.value || ""
  );

  const pathname = request.nextUrl.pathname;

  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  if (!authUser) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const hasPermission =
    authUser?.isSuperAdmin ||
    authUser?.permissions?.find((item: Permission) =>
      item.apiPath.startsWith(`/api/v1${pathname}`)
    );

  if (!hasPermission && pathname !== "/admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
};

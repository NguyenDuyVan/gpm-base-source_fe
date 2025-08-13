import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Permission } from "./types/api";
import { decodeValueCookie } from "./helpers";
import { URL_MANAGEMENT } from "./constants/url";

export function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_AUTH === "true") {
    return NextResponse.next();
  }

  const authUser = decodeValueCookie(
    request.cookies.get("authUser")?.value || ""
  );

  const pathname = request.nextUrl.pathname;

  if (pathname.includes(URL_MANAGEMENT.AUTH)) {
    return NextResponse.next();
  }

  if (!authUser) {
    return NextResponse.redirect(new URL(URL_MANAGEMENT.LOGIN, request.url));
  }
  const hasPermission =
    authUser?.isSuperAdmin ||
    authUser?.permissions?.find((item: Permission) =>
      item.apiPath.startsWith(`${URL_MANAGEMENT.BASE_API}${pathname}`)
    );

  if (!hasPermission && pathname !== URL_MANAGEMENT.ADMIN) {
    return NextResponse.redirect(new URL(URL_MANAGEMENT.ADMIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

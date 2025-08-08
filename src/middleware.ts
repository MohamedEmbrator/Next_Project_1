import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get("jwtToken");
  const token = jwtToken?.value as string;
  if (!token) {
    if (request.nextUrl.pathname.startsWith("/api/users/profile")) {
      return NextResponse.json({ message: "No Token Provided, Access Denied" }, { status: 401 });
    }
  } else {
    if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }
}

export const config = {
  matcher: ["/api/users/profile/:path*", "/login", "/register"]
};

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname === "/login";

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return null;
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};

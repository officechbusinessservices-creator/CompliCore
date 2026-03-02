import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import {
  PROTECTED_PORTAL_PREFIXES,
  PORTAL_ROLE_MAP,
  rolePortalPath,
  type AppRole,
} from "@/lib/rbac";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const userRole = token?.role as AppRole | undefined;

    // Find which portal prefix (if any) this path falls under.
    const matchedPrefix = PROTECTED_PORTAL_PREFIXES.find((prefix) =>
      pathname.startsWith(prefix),
    );

    if (!matchedPrefix) {
      return NextResponse.next();
    }

    // Unauthenticated — send to login.
    if (!token || !userRole) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check whether this role is allowed for the matched portal.
    const allowedRoles = PORTAL_ROLE_MAP[matchedPrefix];
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // Redirect to the user's own portal rather than showing a blank 403.
      const correctPortal = req.nextUrl.clone();
      correctPortal.pathname = rolePortalPath(userRole);
      correctPortal.search = "";
      return NextResponse.redirect(correctPortal);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Let the middleware function above handle auth/redirect logic.
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: [
    "/portal/:path*",
    "/dashboard/:path*",
  ],
};

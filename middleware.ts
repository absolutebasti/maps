import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = [
  "/api/export",
  "/api/share",
  "/api/presets",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // In a real app, you'd check for a session token/JWT here
    // For now, we're using localStorage on the client side
    // Server-side routes should validate auth tokens sent in headers
    
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // In production, validate the token here
    // const token = authHeader.replace("Bearer ", "");
    // if (!isValidToken(token)) {
    //   return NextResponse.json(
    //     { error: "Invalid or expired token" },
    //     { status: 401 }
    //   );
    // }
  }

  return NextResponse.next();
}

// Configure which routes should run the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};


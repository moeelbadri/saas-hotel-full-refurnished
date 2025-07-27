import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth")?.value; // Check for token
  // Define protected routes (adjust as needed)
  const protectedRoutes = [
    "/dashboard","/profile", "/settings","/reports","/statistics",
    "/users","/storage","/guests","/rooms","/bookings"];
    // console.log("Protected route hit:", pathname,token);

  if(token && pathname==="/") return NextResponse.redirect(new URL("/dashboard", request.url));
  if(!token && pathname==="/login") return NextResponse.next();
  // If the user is authenticated, allow access to all routes
  if(token && pathname==="/login") return NextResponse.redirect(new URL("/dashboard", request.url));
  // Redirect unauthenticated users
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token && pathname!=="/login") return NextResponse.redirect(new URL("/login", request.url));
    if (token && pathname==="/") return NextResponse.redirect(new URL("/dashboard", request.url));
    // if (!token) {return NextResponse.redirect(new URL("/login", request.url));}
  }

  return NextResponse.next();
}
// Apply middleware only to protected routes
// export const config = {
//   matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
// };

export const config = {
  matcher: ["/dashboard","/profile", "/settings","/reports","/statistics",
    "/users","/storage","/guests","/rooms","/bookings/:path*","/login"], // Apply middleware to all routes for testing
};

import { type NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/utils/jwt"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected API routes
  const protectedApiRoutes = ["/api/jobs", "/api/applications", "/api/users", "/api/admin"]

  // Check if it's a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some(
    (route) => pathname.startsWith(route) && !pathname.includes("/api/auth"),
  )

  if (isProtectedApiRoute) {
    const token = request.cookies.get("accessToken")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Access token required" }, { status: 401 })
    }

    try {
      const payload = verifyAccessToken(token)

      // Add user info to headers for API routes
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set("x-user-id", payload.userId)
      requestHeaders.set("x-user-email", payload.email)
      requestHeaders.set("x-user-role", payload.role)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/jobs/:path*", "/api/applications/:path*", "/api/users/:path*", "/api/admin/:path*"],
}

import type { NextRequest } from "next/server"
import { successResponse } from "@/utils/errorHandler"

export async function POST(request: NextRequest) {
  const response = successResponse(null, "Logout successful")

  // Clear cookies
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  })

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  })

  return response
}

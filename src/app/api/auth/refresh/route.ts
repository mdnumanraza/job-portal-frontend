import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { verifyRefreshToken, generateTokens } from "@/utils/jwt"
import { handleApiError, successResponse } from "@/utils/errorHandler"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const refreshToken = request.cookies.get("refreshToken")?.value

    if (!refreshToken) {
      return handleApiError({
        message: "Refresh token not found",
        statusCode: 401,
      })
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken)

    // Check if user still exists and is active
    const user = await User.findById(payload.userId)
    if (!user || !user.isActive) {
      return handleApiError({
        message: "User not found or inactive",
        statusCode: 401,
      })
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    const response = successResponse(null, "Tokens refreshed successfully")

    // Set new cookies
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
    })

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    return handleApiError({
      message: "Invalid refresh token",
      statusCode: 401,
    })
  }
}

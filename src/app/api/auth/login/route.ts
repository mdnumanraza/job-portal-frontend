import type { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { loginSchema } from "@/utils/validators"
import { generateTokens } from "@/utils/jwt"
import { handleApiError, successResponse } from "@/utils/errorHandler"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // Validate input
    const { error, value } = loginSchema.validate(body)
    if (error) {
      return handleApiError({
        name: "ValidationError",
        details: error.details,
      })
    }

    const { email, password } = value

    // Find user
    const user = await User.findOne({ email, isActive: true })
    if (!user) {
      return handleApiError({
        message: "Invalid email or password",
        statusCode: 401,
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return handleApiError({
        message: "Invalid email or password",
        statusCode: 401,
      })
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Set cookies
    const response = successResponse(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          organization: user.organization,
        },
      },
      "Login successful",
    )

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
    })

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    return handleApiError(error)
  }
}

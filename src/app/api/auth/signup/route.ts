import type { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { signupSchema } from "@/utils/validators"
import { generateTokens } from "@/utils/jwt"
import { handleApiError, successResponse } from "@/utils/errorHandler"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // Validate input
    const { error, value } = signupSchema.validate(body)
    if (error) {
      return handleApiError({
        name: "ValidationError",
        details: error.details,
      })
    }

    const { name, email, password, role, phone, location, organization } = value

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return handleApiError({
        message: "User with this email already exists",
        statusCode: 409,
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      location,
      organization,
    })

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
        },
      },
      "User registered successfully",
      201,
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

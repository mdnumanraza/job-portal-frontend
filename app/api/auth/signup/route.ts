import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { hashPassword } from "@/utils/auth"
import { generateTokens } from "@/utils/jwt"
import { successResponse, errorResponse } from "@/utils/response"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, password, role = "applicant", phone, location, companyName } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return errorResponse("Name, email, and password are required", 400)
    }

    if (password.length < 6) {
      return errorResponse("Password must be at least 6 characters long", 400)
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return errorResponse("User with this email already exists", 409)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const userData: any = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone,
      location,
    }

    if (role === "employer" && companyName) {
      userData.companyName = companyName
    }

    const user = await User.create(userData)

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
        accessToken,
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
  } catch (error: any) {
    console.error("Signup error:", error)
    return errorResponse("Internal server error", 500)
  }
}

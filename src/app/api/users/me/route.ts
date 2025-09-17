import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/users/me - Get current user's profile (same as auth/me but more detailed)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return handleApiError({
        message: "User ID not found in request",
        statusCode: 401,
      })
    }

    const user = await User.findById(userId).select("-password")

    if (!user) {
      return handleApiError({
        message: "User not found",
        statusCode: 404,
      })
    }

    return successResponse({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      organization: user.organization,
      skills: user.skills,
      education: user.education,
      experience: user.experience,
      resume: user.resume,
      profileImage: user.profileImage,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

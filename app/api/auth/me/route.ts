import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { getUserFromToken } from "@/utils/auth"
import { successResponse, errorResponse } from "@/utils/response"

export async function GET(request: NextRequest) {
  try {
    const tokenUser = getUserFromToken(request)
    if (!tokenUser) {
      return errorResponse("Unauthorized", 401)
    }

    await connectDB()

    const user = await User.findById(tokenUser.userId).select("-password")
    if (!user) {
      return errorResponse("User not found", 404)
    }

    return successResponse(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          avatar: user.avatar,
          companyName: user.companyName,
          skills: user.skills,
          education: user.education,
          experience: user.experience,
        },
      },
      "User data retrieved successfully",
    )
  } catch (error: any) {
    console.error("Get user error:", error)
    return errorResponse("Internal server error", 500)
  }
}

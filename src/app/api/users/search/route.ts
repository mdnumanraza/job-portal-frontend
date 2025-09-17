import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/users/search - Search users (Admin and Employer access)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userRole = request.headers.get("x-user-role")

    // Only admin and employers can search users
    if (userRole !== "admin" && userRole !== "employer") {
      return handleApiError({
        message: "You don't have permission to search users",
        statusCode: 403,
      })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const role = searchParams.get("role")
    const location = searchParams.get("location")
    const skills = searchParams.get("skills")
    const search = searchParams.get("search")

    // Build filter object
    const filter: any = { isActive: true }

    if (role) filter.role = role
    if (location) filter.location = { $regex: location, $options: "i" }
    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim())
      filter.skills = { $in: skillsArray }
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get users (limited fields for privacy)
    const users = await User.find(filter)
      .select("name email role location organization skills education experience profileImage createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments(filter)
    const totalPages = Math.ceil(total / limit)

    return successResponse({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

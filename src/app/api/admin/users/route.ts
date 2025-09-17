import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/admin/users - Get all users with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userRole = request.headers.get("x-user-role")

    if (userRole !== "admin") {
      return handleApiError({
        message: "Admin access required",
        statusCode: 403,
      })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const role = searchParams.get("role")
    const status = searchParams.get("status") // active, inactive
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Build filter object
    const filter: any = {}

    if (role) filter.role = role
    if (status === "active") filter.isActive = true
    if (status === "inactive") filter.isActive = false
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build sort object
    const sort: any = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    // Get users
    const users = await User.find(filter).select("-password").sort(sort).skip(skip).limit(limit)

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

import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import Job from "@/models/Job"
import { getUserFromToken } from "@/utils/auth"
import { successResponse, errorResponse } from "@/utils/response"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    if (user.role !== "employer" && user.role !== "admin") {
      return errorResponse("Only employers can view their jobs", 403)
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || ""

    const query: any = { postedBy: user.userId }

    if (status) {
      query.status = status
    }

    const skip = (page - 1) * limit

    const jobs = await Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Job.countDocuments(query)

    return successResponse(
      {
        jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Your jobs retrieved successfully",
    )
  } catch (error: any) {
    console.error("Get my jobs error:", error)
    return errorResponse("Internal server error", 500)
  }
}

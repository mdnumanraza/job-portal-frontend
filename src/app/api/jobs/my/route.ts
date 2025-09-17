import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Job from "@/models/Job"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/jobs/my - Get employer's own jobs
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    if (userRole !== "employer") {
      return handleApiError({
        message: "Only employers can access this endpoint",
        statusCode: 403,
      })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    // Build filter
    const filter: any = { postedBy: userId }
    if (status) filter.status = status

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get jobs
    const jobs = await Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Job.countDocuments(filter)
    const totalPages = Math.ceil(total / limit)

    // Get job statistics
    const stats = await Job.aggregate([
      { $match: { postedBy: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    const jobStats = {
      total: total,
      active: stats.find((s) => s._id === "active")?.count || 0,
      closed: stats.find((s) => s._id === "closed")?.count || 0,
      draft: stats.find((s) => s._id === "draft")?.count || 0,
    }

    return successResponse({
      jobs,
      stats: jobStats,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

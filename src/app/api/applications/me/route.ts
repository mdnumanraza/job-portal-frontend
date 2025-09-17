import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Application from "@/models/Application"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/applications/me - Get applicant's applications
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    if (userRole !== "applicant") {
      return handleApiError({
        message: "Only applicants can access this endpoint",
        statusCode: 403,
      })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    // Build filter
    const filter: any = { applicantId: userId }
    if (status) filter.status = status

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get applications with job details
    const applications = await Application.find(filter)
      .populate({
        path: "jobId",
        select: "title description location category jobType salary postedBy status",
        populate: {
          path: "postedBy",
          select: "name organization",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Application.countDocuments(filter)
    const totalPages = Math.ceil(total / limit)

    // Get application statistics
    const stats = await Application.aggregate([
      { $match: { applicantId: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    const applicationStats = {
      total: total,
      applied: stats.find((s) => s._id === "applied")?.count || 0,
      underReview: stats.find((s) => s._id === "under review")?.count || 0,
      accepted: stats.find((s) => s._id === "accepted")?.count || 0,
      rejected: stats.find((s) => s._id === "rejected")?.count || 0,
    }

    return successResponse({
      applications,
      stats: applicationStats,
      pagination: {
        currentPage: page,
        totalPages,
        totalApplications: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

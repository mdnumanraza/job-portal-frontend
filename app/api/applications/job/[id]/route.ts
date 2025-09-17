import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import Application from "@/models/Application"
import Job from "@/models/Job"
import { getUserFromToken } from "@/utils/auth"
import { successResponse, errorResponse } from "@/utils/response"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    await connectDB()

    // Check if job exists and user owns it
    const job = await Job.findById(params.id)
    if (!job) {
      return errorResponse("Job not found", 404)
    }

    if (job.postedBy.toString() !== user.userId && user.role !== "admin") {
      return errorResponse("You can only view applications for your own jobs", 403)
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || ""

    const query: any = { jobId: params.id }

    if (status) {
      query.status = status
    }

    const skip = (page - 1) * limit

    const applications = await Application.find(query)
      .populate("applicantId", "name email phone location skills education experience")
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Application.countDocuments(query)

    // Get application stats
    const stats = await Application.aggregate([
      { $match: { jobId: job._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ])

    const applicationStats = {
      total: 0,
      applied: 0,
      "under review": 0,
      accepted: 0,
      rejected: 0,
    }

    stats.forEach((stat) => {
      applicationStats[stat._id as keyof typeof applicationStats] = stat.count
      applicationStats.total += stat.count
    })

    return successResponse(
      {
        applications,
        stats: applicationStats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Job applications retrieved successfully",
    )
  } catch (error: any) {
    console.error("Get job applications error:", error)
    return errorResponse("Internal server error", 500)
  }
}

import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Application from "@/models/Application"
import Job from "@/models/Job"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/applications/job/[id] - Get applications for a specific job (Employer only)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    // Check if job exists
    const job = await Job.findById(params.id)
    if (!job) {
      return handleApiError({
        message: "Job not found",
        statusCode: 404,
      })
    }

    // Check if user is the job owner or admin
    if (userRole !== "admin" && job.postedBy.toString() !== userId) {
      return handleApiError({
        message: "You can only view applications for your own jobs",
        statusCode: 403,
      })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    // Build filter
    const filter: any = { jobId: params.id }
    if (status) filter.status = status

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get applications with applicant details
    const applications = await Application.find(filter)
      .populate({
        path: "applicantId",
        select: "name email phone location skills education experience resume profileImage",
      })
      .populate({
        path: "jobId",
        select: "title category location",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Application.countDocuments(filter)
    const totalPages = Math.ceil(total / limit)

    // Get application statistics for this job
    const stats = await Application.aggregate([
      { $match: { jobId: params.id } },
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
      job: {
        id: job._id,
        title: job.title,
        category: job.category,
        location: job.location,
      },
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

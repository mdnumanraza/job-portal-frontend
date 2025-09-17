import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Application from "@/models/Application"
import { successResponse, handleApiError } from "@/utils/errorHandler"

// GET /api/applications/stats - Get application statistics
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    let matchStage: any = {}

    // Filter based on user role
    if (userRole === "applicant") {
      matchStage = { applicantId: userId }
    } else if (userRole === "employer") {
      // Get applications for employer's jobs
      const Job = require("@/models/Job").default
      const employerJobs = await Job.find({ postedBy: userId }).select("_id")
      const jobIds = employerJobs.map((job: any) => job._id)
      matchStage = { jobId: { $in: jobIds } }
    }
    // Admin can see all stats (no filter)

    // Get application statistics
    const stats = await Application.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    // Get recent applications (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentApplications = await Application.countDocuments({
      ...matchStage,
      createdAt: { $gte: sevenDaysAgo },
    })

    // Total applications
    const totalApplications = await Application.countDocuments(matchStage)

    const applicationStats = {
      total: totalApplications,
      recent: recentApplications,
      applied: stats.find((s) => s._id === "applied")?.count || 0,
      underReview: stats.find((s) => s._id === "under review")?.count || 0,
      accepted: stats.find((s) => s._id === "accepted")?.count || 0,
      rejected: stats.find((s) => s._id === "rejected")?.count || 0,
    }

    return successResponse(applicationStats)
  } catch (error) {
    return handleApiError(error)
  }
}

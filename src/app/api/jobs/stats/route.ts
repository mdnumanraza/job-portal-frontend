import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Job from "@/models/Job"
import Application from "@/models/Application"
import { successResponse, handleApiError } from "@/utils/errorHandler"

// GET /api/jobs/stats - Get general job statistics
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Total active jobs
    const totalJobs = await Job.countDocuments({ status: "active" })

    // Jobs by category
    const jobsByCategory = await Job.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ])

    // Recent jobs (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentJobs = await Job.countDocuments({
      status: "active",
      createdAt: { $gte: sevenDaysAgo },
    })

    // Total applications
    const totalApplications = await Application.countDocuments()

    return successResponse({
      totalJobs,
      recentJobs,
      totalApplications,
      jobsByCategory: jobsByCategory.map((jbc) => ({
        category: jbc._id,
        count: jbc.count,
      })),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

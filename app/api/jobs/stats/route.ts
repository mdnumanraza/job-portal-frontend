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

    await connectDB()

    if (user.role === "employer") {
      // Get employer stats
      const totalJobs = await Job.countDocuments({ postedBy: user.userId })
      const activeJobs = await Job.countDocuments({ postedBy: user.userId, status: "active" })
      const closedJobs = await Job.countDocuments({ postedBy: user.userId, status: "closed" })
      const draftJobs = await Job.countDocuments({ postedBy: user.userId, status: "draft" })

      return successResponse(
        {
          totalJobs,
          activeJobs,
          closedJobs,
          draftJobs,
        },
        "Employer stats retrieved successfully",
      )
    } else {
      // Get general stats for applicants/admin
      const totalJobs = await Job.countDocuments({ status: "active" })
      const jobsByCategory = await Job.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ])

      return successResponse(
        {
          totalJobs,
          jobsByCategory,
        },
        "Job stats retrieved successfully",
      )
    }
  } catch (error: any) {
    console.error("Get job stats error:", error)
    return errorResponse("Internal server error", 500)
  }
}

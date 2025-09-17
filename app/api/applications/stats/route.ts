import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import Application from "@/models/Application"
import { getUserFromToken } from "@/utils/auth"
import { successResponse, errorResponse } from "@/utils/response"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    await connectDB()

    if (user.role === "applicant") {
      // Get applicant stats
      const totalApplications = await Application.countDocuments({ applicantId: user.userId })
      const applicationsByStatus = await Application.aggregate([
        { $match: { applicantId: user.userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])

      const stats = {
        total: totalApplications,
        applied: 0,
        "under review": 0,
        accepted: 0,
        rejected: 0,
      }

      applicationsByStatus.forEach((stat) => {
        stats[stat._id as keyof typeof stats] = stat.count
      })

      return successResponse(stats, "Application stats retrieved successfully")
    } else {
      return errorResponse("Only applicants can view application stats", 403)
    }
  } catch (error: any) {
    console.error("Get application stats error:", error)
    return errorResponse("Internal server error", 500)
  }
}

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

    if (user.role !== "applicant") {
      return errorResponse("Only applicants can view their applications", 403)
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || ""

    const query: any = { applicantId: user.userId }

    if (status) {
      query.status = status
    }

    const skip = (page - 1) * limit

    const applications = await Application.find(query)
      .populate("jobId", "title location category salary jobType status")
      .populate({
        path: "jobId",
        populate: {
          path: "postedBy",
          select: "name companyName",
        },
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Application.countDocuments(query)

    return successResponse(
      {
        applications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Your applications retrieved successfully",
    )
  } catch (error: any) {
    console.error("Get my applications error:", error)
    return errorResponse("Internal server error", 500)
  }
}

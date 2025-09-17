import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Job from "@/models/Job"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/admin/jobs - Get all jobs with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userRole = request.headers.get("x-user-role")

    if (userRole !== "admin") {
      return handleApiError({
        message: "Admin access required",
        statusCode: 403,
      })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const location = searchParams.get("location")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Build filter object
    const filter: any = {}

    if (category) filter.category = category
    if (status) filter.status = status
    if (location) filter.location = { $regex: location, $options: "i" }
    if (search) {
      filter.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build sort object
    const sort: any = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    // Get jobs with employer details
    const jobs = await Job.find(filter)
      .populate("postedBy", "name email organization")
      .sort(sort)
      .skip(skip)
      .limit(limit)

    const total = await Job.countDocuments(filter)
    const totalPages = Math.ceil(total / limit)

    return successResponse({
      jobs,
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

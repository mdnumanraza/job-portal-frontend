import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Job from "@/models/Job"
import { jobSchema } from "@/utils/validators"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/jobs - Get all jobs with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const jobType = searchParams.get("jobType")
    const salaryType = searchParams.get("salaryType") // "disclosed" or "not-disclosed"
    const search = searchParams.get("search")

    // Build filter object
    const filter: any = { status: "active" }

    if (category) filter.category = category
    if (location) filter.location = { $regex: location, $options: "i" }
    if (jobType) filter.jobType = jobType
    if (salaryType === "disclosed") filter.salary = { $ne: "Not disclosed" }
    if (salaryType === "not-disclosed") filter.salary = "Not disclosed"
    if (search) {
      filter.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get jobs with employer details
    const jobs = await Job.find(filter)
      .populate("postedBy", "name organization location")
      .sort({ createdAt: -1 })
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

// POST /api/jobs - Create new job (Employer only)
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    if (userRole !== "employer") {
      return handleApiError({
        message: "Only employers can create jobs",
        statusCode: 403,
      })
    }

    const body = await request.json()

    // Validate input
    const { error, value } = jobSchema.validate(body)
    if (error) {
      return handleApiError({
        name: "ValidationError",
        details: error.details,
      })
    }

    // Create job
    const job = await Job.create({
      ...value,
      postedBy: userId,
    })

    // Populate employer details
    await job.populate("postedBy", "name organization location")

    return successResponse(job, "Job created successfully", 201)
  } catch (error) {
    return handleApiError(error)
  }
}

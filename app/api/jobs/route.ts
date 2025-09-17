import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import Job from "@/models/Job"
import { getUserFromToken } from "@/utils/auth"
import { successResponse, errorResponse } from "@/utils/response"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const location = searchParams.get("location") || ""
    const jobType = searchParams.get("jobType") || ""
    const salaryType = searchParams.get("salaryType") || ""

    // Build query
    const query: any = { status: "active" }

    // Search in title and description
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Filter by category
    if (category) {
      query.category = category
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: "i" }
    }

    // Filter by job type
    if (jobType) {
      query.jobType = jobType
    }

    // Filter by salary type
    if (salaryType === "disclosed") {
      query.salary = { $ne: "Not disclosed" }
    } else if (salaryType === "not-disclosed") {
      query.salary = "Not disclosed"
    }

    const skip = (page - 1) * limit

    // Get jobs with pagination
    const jobs = await Job.find(query)
      .populate("postedBy", "name companyName location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Job.countDocuments(query)

    return successResponse(
      {
        jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Jobs retrieved successfully",
    )
  } catch (error: any) {
    console.error("Get jobs error:", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    if (user.role !== "employer" && user.role !== "admin") {
      return errorResponse("Only employers can create jobs", 403)
    }

    await connectDB()

    const { title, description, requirements, location, category, salary, jobType } = await request.json()

    // Validation
    if (!title || !description || !requirements || !location || !category || !jobType) {
      return errorResponse("All required fields must be provided", 400)
    }

    if (!["imam", "teacher", "tutor", "helper"].includes(category)) {
      return errorResponse("Invalid category", 400)
    }

    if (!["full-time", "part-time", "contract", "remote"].includes(jobType)) {
      return errorResponse("Invalid job type", 400)
    }

    // Create job
    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      location,
      category,
      salary: salary || "Not disclosed",
      jobType,
      postedBy: user.userId,
    })

    const populatedJob = await Job.findById(job._id).populate("postedBy", "name companyName location")

    return successResponse(populatedJob, "Job created successfully", 201)
  } catch (error: any) {
    console.error("Create job error:", error)
    return errorResponse("Internal server error", 500)
  }
}

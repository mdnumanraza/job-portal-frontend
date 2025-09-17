import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import Job from "@/models/Job"
import { getUserFromToken } from "@/utils/auth"
import { successResponse, errorResponse } from "@/utils/response"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const job = await Job.findById(params.id).populate(
      "postedBy",
      "name companyName location email phone website companyDescription",
    )

    if (!job) {
      return errorResponse("Job not found", 404)
    }

    return successResponse(job, "Job retrieved successfully")
  } catch (error: any) {
    console.error("Get job error:", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    await connectDB()

    const job = await Job.findById(params.id)
    if (!job) {
      return errorResponse("Job not found", 404)
    }

    // Check if user owns the job or is admin
    if (job.postedBy.toString() !== user.userId && user.role !== "admin") {
      return errorResponse("You can only update your own jobs", 403)
    }

    const { title, description, requirements, location, category, salary, jobType, status } = await request.json()

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      params.id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(requirements && { requirements: Array.isArray(requirements) ? requirements : [requirements] }),
        ...(location && { location }),
        ...(category && { category }),
        ...(salary !== undefined && { salary }),
        ...(jobType && { jobType }),
        ...(status && { status }),
      },
      { new: true, runValidators: true },
    ).populate("postedBy", "name companyName location")

    return successResponse(updatedJob, "Job updated successfully")
  } catch (error: any) {
    console.error("Update job error:", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    await connectDB()

    const job = await Job.findById(params.id)
    if (!job) {
      return errorResponse("Job not found", 404)
    }

    // Check if user owns the job or is admin
    if (job.postedBy.toString() !== user.userId && user.role !== "admin") {
      return errorResponse("You can only delete your own jobs", 403)
    }

    await Job.findByIdAndDelete(params.id)

    return successResponse(null, "Job deleted successfully")
  } catch (error: any) {
    console.error("Delete job error:", error)
    return errorResponse("Internal server error", 500)
  }
}

import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Job from "@/models/Job"
import { jobSchema } from "@/utils/validators"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/jobs/[id] - Get job by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const job = await Job.findById(params.id).populate("postedBy", "name organization location phone email")

    if (!job) {
      return handleApiError({
        message: "Job not found",
        statusCode: 404,
      })
    }

    return successResponse(job)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/jobs/[id] - Update job (Employer only - own jobs)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    // Find job
    const job = await Job.findById(params.id)
    if (!job) {
      return handleApiError({
        message: "Job not found",
        statusCode: 404,
      })
    }

    // Check ownership (employer can only update their own jobs, admin can update any)
    if (userRole !== "admin" && job.postedBy.toString() !== userId) {
      return handleApiError({
        message: "You can only update your own jobs",
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

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(params.id, value, { new: true, runValidators: true }).populate(
      "postedBy",
      "name organization location",
    )

    return successResponse(updatedJob, "Job updated successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/jobs/[id] - Delete job (Employer only - own jobs)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    // Find job
    const job = await Job.findById(params.id)
    if (!job) {
      return handleApiError({
        message: "Job not found",
        statusCode: 404,
      })
    }

    // Check ownership (employer can only delete their own jobs, admin can delete any)
    if (userRole !== "admin" && job.postedBy.toString() !== userId) {
      return handleApiError({
        message: "You can only delete your own jobs",
        statusCode: 403,
      })
    }

    await Job.findByIdAndDelete(params.id)

    return successResponse(null, "Job deleted successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

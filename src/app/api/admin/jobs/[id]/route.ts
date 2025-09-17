import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Job from "@/models/Job"
import Application from "@/models/Application"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// PUT /api/admin/jobs/[id] - Update job status
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userRole = request.headers.get("x-user-role")

    if (userRole !== "admin") {
      return handleApiError({
        message: "Admin access required",
        statusCode: 403,
      })
    }

    const body = await request.json()
    const { status } = body

    if (!status || !["active", "closed", "draft"].includes(status)) {
      return handleApiError({
        message: "Invalid status. Must be one of: active, closed, draft",
        statusCode: 400,
      })
    }

    const updatedJob = await Job.findByIdAndUpdate(params.id, { status }, { new: true, runValidators: true }).populate(
      "postedBy",
      "name organization",
    )

    if (!updatedJob) {
      return handleApiError({
        message: "Job not found",
        statusCode: 404,
      })
    }

    return successResponse(updatedJob, "Job status updated successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/admin/jobs/[id] - Delete job
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userRole = request.headers.get("x-user-role")

    if (userRole !== "admin") {
      return handleApiError({
        message: "Admin access required",
        statusCode: 403,
      })
    }

    const job = await Job.findById(params.id)

    if (!job) {
      return handleApiError({
        message: "Job not found",
        statusCode: 404,
      })
    }

    // Delete all applications for this job
    await Application.deleteMany({ jobId: params.id })

    // Delete the job
    await Job.findByIdAndDelete(params.id)

    return successResponse(null, "Job and related applications deleted successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

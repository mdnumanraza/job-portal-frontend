import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Application from "@/models/Application"
import Job from "@/models/Job"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/applications/[id] - Get application by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    const application = await Application.findById(params.id)
      .populate({
        path: "jobId",
        select: "title description location category jobType salary postedBy",
        populate: {
          path: "postedBy",
          select: "name organization email phone",
        },
      })
      .populate({
        path: "applicantId",
        select: "name email phone location skills education experience resume profileImage",
      })

    if (!application) {
      return handleApiError({
        message: "Application not found",
        statusCode: 404,
      })
    }

    // Check access permissions
    const isApplicant = application.applicantId._id.toString() === userId
    const isJobOwner = application.jobId.postedBy._id.toString() === userId
    const isAdmin = userRole === "admin"

    if (!isApplicant && !isJobOwner && !isAdmin) {
      return handleApiError({
        message: "You don't have permission to view this application",
        statusCode: 403,
      })
    }

    return successResponse(application)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/applications/[id] - Update application status (Employer/Admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    const application = await Application.findById(params.id).populate("jobId")

    if (!application) {
      return handleApiError({
        message: "Application not found",
        statusCode: 404,
      })
    }

    // Check if user is the job owner or admin
    const isJobOwner = application.jobId.postedBy.toString() === userId
    const isAdmin = userRole === "admin"

    if (!isJobOwner && !isAdmin) {
      return handleApiError({
        message: "You can only update applications for your own jobs",
        statusCode: 403,
      })
    }

    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ["applied", "under review", "accepted", "rejected"]
    if (!validStatuses.includes(status)) {
      return handleApiError({
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
        statusCode: 400,
      })
    }

    // Update application
    const updatedApplication = await Application.findByIdAndUpdate(
      params.id,
      { status },
      { new: true, runValidators: true },
    )
      .populate({
        path: "jobId",
        select: "title category location",
      })
      .populate({
        path: "applicantId",
        select: "name email phone location",
      })

    return successResponse(updatedApplication, "Application status updated successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/applications/[id] - Delete application (Applicant only - own applications)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    const application = await Application.findById(params.id)

    if (!application) {
      return handleApiError({
        message: "Application not found",
        statusCode: 404,
      })
    }

    // Check if user is the applicant or admin
    const isApplicant = application.applicantId.toString() === userId
    const isAdmin = userRole === "admin"

    if (!isApplicant && !isAdmin) {
      return handleApiError({
        message: "You can only delete your own applications",
        statusCode: 403,
      })
    }

    // Delete application
    await Application.findByIdAndDelete(params.id)

    // Update job applications count
    await Job.findByIdAndUpdate(application.jobId, {
      $inc: { applicationsCount: -1 },
    })

    return successResponse(null, "Application deleted successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

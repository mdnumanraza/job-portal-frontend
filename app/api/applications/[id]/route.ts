import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import Application from "@/models/Application"
import Job from "@/models/Job"
import { getUserFromToken } from "@/utils/auth"
import { successResponse, errorResponse } from "@/utils/response"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    await connectDB()

    const application = await Application.findById(params.id)
      .populate("jobId", "title description location category salary jobType")
      .populate("applicantId", "name email phone location skills education experience")
      .populate({
        path: "jobId",
        populate: {
          path: "postedBy",
          select: "name companyName",
        },
      })

    if (!application) {
      return errorResponse("Application not found", 404)
    }

    // Check permissions
    const isApplicant = application.applicantId._id.toString() === user.userId
    const isJobOwner = application.jobId.postedBy._id.toString() === user.userId
    const isAdmin = user.role === "admin"

    if (!isApplicant && !isJobOwner && !isAdmin) {
      return errorResponse("You do not have permission to view this application", 403)
    }

    return successResponse(application, "Application retrieved successfully")
  } catch (error: any) {
    console.error("Get application error:", error)
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

    const application = await Application.findById(params.id).populate("jobId")
    if (!application) {
      return errorResponse("Application not found", 404)
    }

    const { status } = await request.json()

    // Check if user can update this application
    const job = await Job.findById(application.jobId)
    const isJobOwner = job?.postedBy.toString() === user.userId
    const isAdmin = user.role === "admin"

    if (!isJobOwner && !isAdmin) {
      return errorResponse("You can only update applications for your own jobs", 403)
    }

    // Validate status
    if (!["applied", "under review", "accepted", "rejected"].includes(status)) {
      return errorResponse("Invalid status", 400)
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      params.id,
      { status },
      { new: true, runValidators: true },
    )
      .populate("jobId", "title location")
      .populate("applicantId", "name email")

    return successResponse(updatedApplication, "Application status updated successfully")
  } catch (error: any) {
    console.error("Update application error:", error)
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

    const application = await Application.findById(params.id)
    if (!application) {
      return errorResponse("Application not found", 404)
    }

    // Check if user owns the application or is admin
    const isApplicant = application.applicantId.toString() === user.userId
    const isAdmin = user.role === "admin"

    if (!isApplicant && !isAdmin) {
      return errorResponse("You can only delete your own applications", 403)
    }

    await Application.findByIdAndDelete(params.id)

    // Update job applications count
    await Job.findByIdAndUpdate(application.jobId, {
      $inc: { applicationsCount: -1 },
    })

    return successResponse(null, "Application deleted successfully")
  } catch (error: any) {
    console.error("Delete application error:", error)
    return errorResponse("Internal server error", 500)
  }
}

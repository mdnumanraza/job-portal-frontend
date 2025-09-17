import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import Application from "@/models/Application"
import Job from "@/models/Job"
import { getUserFromToken } from "@/utils/auth"
import { successResponse, errorResponse } from "@/utils/response"

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    if (user.role !== "applicant") {
      return errorResponse("Only applicants can apply for jobs", 403)
    }

    await connectDB()

    const { jobId, coverLetter, resume } = await request.json()

    // Validation
    if (!jobId) {
      return errorResponse("Job ID is required", 400)
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId)
    if (!job) {
      return errorResponse("Job not found", 404)
    }

    if (job.status !== "active") {
      return errorResponse("This job is no longer accepting applications", 400)
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      jobId,
      applicantId: user.userId,
    })

    if (existingApplication) {
      return errorResponse("You have already applied for this job", 409)
    }

    // Create application
    const application = await Application.create({
      jobId,
      applicantId: user.userId,
      coverLetter,
      resume,
    })

    // Update job applications count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 },
    })

    const populatedApplication = await Application.findById(application._id)
      .populate("jobId", "title company location")
      .populate("applicantId", "name email phone")

    return successResponse(populatedApplication, "Application submitted successfully", 201)
  } catch (error: any) {
    console.error("Create application error:", error)
    return errorResponse("Internal server error", 500)
  }
}

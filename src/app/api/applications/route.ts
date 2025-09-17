import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Application from "@/models/Application"
import Job from "@/models/Job"
import { applicationSchema } from "@/utils/validators"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// POST /api/applications - Apply to a job (Applicant only)
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    if (userRole !== "applicant") {
      return handleApiError({
        message: "Only applicants can apply to jobs",
        statusCode: 403,
      })
    }

    const body = await request.json()

    // Validate input
    const { error, value } = applicationSchema.validate(body)
    if (error) {
      return handleApiError({
        name: "ValidationError",
        details: error.details,
      })
    }

    const { jobId, coverLetter, resume } = value

    // Check if job exists and is active
    const job = await Job.findById(jobId)
    if (!job) {
      return handleApiError({
        message: "Job not found",
        statusCode: 404,
      })
    }

    if (job.status !== "active") {
      return handleApiError({
        message: "This job is no longer accepting applications",
        statusCode: 400,
      })
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      jobId,
      applicantId: userId,
    })

    if (existingApplication) {
      return handleApiError({
        message: "You have already applied to this job",
        statusCode: 409,
      })
    }

    // Create application
    const application = await Application.create({
      jobId,
      applicantId: userId,
      coverLetter,
      resume,
    })

    // Update job applications count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 },
    })

    // Populate application with job and applicant details
    await application.populate([
      {
        path: "jobId",
        select: "title company location category",
      },
      {
        path: "applicantId",
        select: "name email phone location",
      },
    ])

    return successResponse(application, "Application submitted successfully", 201)
  } catch (error) {
    return handleApiError(error)
  }
}

import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import Job from "@/models/Job"
import Application from "@/models/Application"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/admin/users/[id] - Get detailed user information
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userRole = request.headers.get("x-user-role")

    if (userRole !== "admin") {
      return handleApiError({
        message: "Admin access required",
        statusCode: 403,
      })
    }

    const user = await User.findById(params.id).select("-password")

    if (!user) {
      return handleApiError({
        message: "User not found",
        statusCode: 404,
      })
    }

    // Get user's jobs if employer
    let jobs = []
    if (user.role === "employer") {
      jobs = await Job.find({ postedBy: params.id })
        .select("title category location status applicationsCount createdAt")
        .sort({ createdAt: -1 })
    }

    // Get user's applications if applicant
    let applications = []
    if (user.role === "applicant") {
      applications = await Application.find({ applicantId: params.id })
        .populate("jobId", "title category location")
        .select("status createdAt")
        .sort({ createdAt: -1 })
    }

    return successResponse({
      user,
      jobs,
      applications,
      stats: {
        jobsPosted: jobs.length,
        applicationsSubmitted: applications.length,
        activeJobs: jobs.filter((job: any) => job.status === "active").length,
        acceptedApplications: applications.filter((app: any) => app.status === "accepted").length,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/admin/users/[id] - Update user status or role
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
    const { isActive, role } = body

    const updateData: any = {}
    if (typeof isActive === "boolean") updateData.isActive = isActive
    if (role && ["applicant", "employer", "admin"].includes(role)) updateData.role = role

    if (Object.keys(updateData).length === 0) {
      return handleApiError({
        message: "No valid fields to update",
        statusCode: 400,
      })
    }

    const updatedUser = await User.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password")

    if (!updatedUser) {
      return handleApiError({
        message: "User not found",
        statusCode: 404,
      })
    }

    return successResponse(updatedUser, "User updated successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/admin/users/[id] - Delete user (soft delete by deactivating)
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

    const user = await User.findById(params.id)

    if (!user) {
      return handleApiError({
        message: "User not found",
        statusCode: 404,
      })
    }

    // Soft delete by deactivating
    await User.findByIdAndUpdate(params.id, { isActive: false })

    // If employer, close all their active jobs
    if (user.role === "employer") {
      await Job.updateMany({ postedBy: params.id, status: "active" }, { status: "closed" })
    }

    return successResponse(null, "User deactivated successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

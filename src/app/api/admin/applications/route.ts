import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Application from "@/models/Application"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/admin/applications - Get all applications with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userRole = request.headers.get("x-user-role")

    if (userRole !== "admin") {
      return handleApiError({
        message: "Admin access required",
        statusCode: 403,
      })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const jobCategory = searchParams.get("jobCategory")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Build filter object
    const filter: any = {}
    if (status) filter.status = status

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build sort object
    const sort: any = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    // Build aggregation pipeline
    const pipeline: any[] = [
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "applicantId",
          foreignField: "_id",
          as: "applicant",
        },
      },
      {
        $unwind: "$job",
      },
      {
        $unwind: "$applicant",
      },
    ]

    // Add job category filter if specified
    if (jobCategory) {
      pipeline.push({
        $match: {
          "job.category": jobCategory,
        },
      })
    }

    // Add status filter if specified
    if (status) {
      pipeline.push({
        $match: {
          status: status,
        },
      })
    }

    // Add sorting
    pipeline.push({ $sort: sort })

    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limit })

    // Project fields
    pipeline.push({
      $project: {
        _id: 1,
        status: 1,
        coverLetter: 1,
        resume: 1,
        createdAt: 1,
        updatedAt: 1,
        job: {
          _id: "$job._id",
          title: "$job.title",
          category: "$job.category",
          location: "$job.location",
        },
        applicant: {
          _id: "$applicant._id",
          name: "$applicant.name",
          email: "$applicant.email",
          location: "$applicant.location",
        },
      },
    })

    const applications = await Application.aggregate(pipeline)

    // Get total count for pagination
    const countPipeline = [...pipeline.slice(0, -3)] // Remove sort, skip, limit, and project
    countPipeline.push({ $count: "total" })
    const countResult = await Application.aggregate(countPipeline)
    const total = countResult[0]?.total || 0
    const totalPages = Math.ceil(total / limit)

    return successResponse({
      applications,
      pagination: {
        currentPage: page,
        totalPages,
        totalApplications: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

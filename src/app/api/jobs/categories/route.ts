import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Job from "@/models/Job"
import { successResponse, handleApiError } from "@/utils/errorHandler"

// GET /api/jobs/categories - Get job categories with counts
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const categories = await Job.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    const locations = await Job.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 }, // Top 20 locations
    ])

    const jobTypes = await Job.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: "$jobType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    return successResponse({
      categories: categories.map((c) => ({ name: c._id, count: c.count })),
      locations: locations.map((l) => ({ name: l._id, count: l.count })),
      jobTypes: jobTypes.map((jt) => ({ name: jt._id, count: jt.count })),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

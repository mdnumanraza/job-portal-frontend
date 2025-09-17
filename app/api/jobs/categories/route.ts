import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import Job from "@/models/Job"
import { successResponse, errorResponse } from "@/utils/response"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get job counts by category
    const categories = await Job.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    const categoryData = [
      { name: "imam", label: "Imam", count: 0 },
      { name: "teacher", label: "Teacher", count: 0 },
      { name: "tutor", label: "Tutor", count: 0 },
      { name: "helper", label: "Helper", count: 0 },
    ]

    // Update counts from aggregation
    categories.forEach((cat) => {
      const category = categoryData.find((c) => c.name === cat._id)
      if (category) {
        category.count = cat.count
      }
    })

    return successResponse(categoryData, "Categories retrieved successfully")
  } catch (error: any) {
    console.error("Get categories error:", error)
    return errorResponse("Internal server error", 500)
  }
}

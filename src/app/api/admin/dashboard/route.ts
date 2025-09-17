import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import Job from "@/models/Job"
import Application from "@/models/Application"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/admin/dashboard - Get admin dashboard statistics
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

    // Get current date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // User statistics
    const totalUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    })
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ])

    // Job statistics
    const totalJobs = await Job.countDocuments()
    const activeJobs = await Job.countDocuments({ status: "active" })
    const newJobsThisMonth = await Job.countDocuments({
      createdAt: { $gte: startOfMonth },
    })
    const jobsByCategory = await Job.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ])

    // Application statistics
    const totalApplications = await Application.countDocuments()
    const newApplicationsThisMonth = await Application.countDocuments({
      createdAt: { $gte: startOfMonth },
    })
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    // Recent activity (last 30 days)
    const recentUsers = await User.find({
      createdAt: { $gte: thirtyDaysAgo },
    })
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(10)

    const recentJobs = await Job.find({
      createdAt: { $gte: thirtyDaysAgo },
    })
      .populate("postedBy", "name organization")
      .select("title category location status createdAt")
      .sort({ createdAt: -1 })
      .limit(10)

    const recentApplications = await Application.find({
      createdAt: { $gte: thirtyDaysAgo },
    })
      .populate("jobId", "title")
      .populate("applicantId", "name email")
      .select("status createdAt")
      .sort({ createdAt: -1 })
      .limit(10)

    // Growth trends (last 12 months)
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    const jobGrowth = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    return successResponse({
      overview: {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        totalJobs,
        activeJobs,
        newJobsThisMonth,
        totalApplications,
        newApplicationsThisMonth,
      },
      usersByRole: usersByRole.map((ur) => ({
        role: ur._id,
        count: ur.count,
      })),
      jobsByCategory: jobsByCategory.map((jbc) => ({
        category: jbc._id,
        count: jbc.count,
      })),
      applicationsByStatus: applicationsByStatus.map((abs) => ({
        status: abs._id,
        count: abs.count,
      })),
      recentActivity: {
        users: recentUsers,
        jobs: recentJobs,
        applications: recentApplications,
      },
      growth: {
        users: userGrowth,
        jobs: jobGrowth,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

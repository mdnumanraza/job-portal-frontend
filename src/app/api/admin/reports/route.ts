import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import Job from "@/models/Job"
import Application from "@/models/Application"
import { handleApiError, successResponse } from "@/utils/errorHandler"

// GET /api/admin/reports - Generate comprehensive system reports
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
    const reportType = searchParams.get("type") || "overview"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build date filter
    const dateFilter: any = {}
    if (startDate) dateFilter.$gte = new Date(startDate)
    if (endDate) dateFilter.$lte = new Date(endDate)

    const hasDateFilter = Object.keys(dateFilter).length > 0

    switch (reportType) {
      case "users":
        // User registration trends
        const userRegistrations = await User.aggregate([
          ...(hasDateFilter ? [{ $match: { createdAt: dateFilter } }] : []),
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              count: { $sum: 1 },
              roles: {
                $push: "$role",
              },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ])

        // User activity by location
        const usersByLocation = await User.aggregate([
          { $match: { location: { $exists: true, $ne: "" } } },
          {
            $group: {
              _id: "$location",
              count: { $sum: 1 },
              roles: {
                $push: "$role",
              },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 20 },
        ])

        return successResponse({
          type: "users",
          registrations: userRegistrations,
          locationDistribution: usersByLocation,
        })

      case "jobs":
        // Job posting trends
        const jobPostings = await Job.aggregate([
          ...(hasDateFilter ? [{ $match: { createdAt: dateFilter } }] : []),
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              count: { $sum: 1 },
              categories: {
                $push: "$category",
              },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ])

        // Most popular job categories
        const popularCategories = await Job.aggregate([
          {
            $group: {
              _id: "$category",
              totalJobs: { $sum: 1 },
              activeJobs: {
                $sum: {
                  $cond: [{ $eq: ["$status", "active"] }, 1, 0],
                },
              },
              totalApplications: { $sum: "$applicationsCount" },
            },
          },
          { $sort: { totalJobs: -1 } },
        ])

        return successResponse({
          type: "jobs",
          postings: jobPostings,
          categories: popularCategories,
        })

      case "applications":
        // Application trends
        const applicationTrends = await Application.aggregate([
          ...(hasDateFilter ? [{ $match: { createdAt: dateFilter } }] : []),
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              count: { $sum: 1 },
              statuses: {
                $push: "$status",
              },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ])

        // Success rates by job category
        const successRates = await Application.aggregate([
          {
            $lookup: {
              from: "jobs",
              localField: "jobId",
              foreignField: "_id",
              as: "job",
            },
          },
          { $unwind: "$job" },
          {
            $group: {
              _id: "$job.category",
              totalApplications: { $sum: 1 },
              acceptedApplications: {
                $sum: {
                  $cond: [{ $eq: ["$status", "accepted"] }, 1, 0],
                },
              },
            },
          },
          {
            $project: {
              category: "$_id",
              totalApplications: 1,
              acceptedApplications: 1,
              successRate: {
                $multiply: [{ $divide: ["$acceptedApplications", "$totalApplications"] }, 100],
              },
            },
          },
          { $sort: { successRate: -1 } },
        ])

        return successResponse({
          type: "applications",
          trends: applicationTrends,
          successRates: successRates,
        })

      default:
        // Overview report
        const totalUsers = await User.countDocuments()
        const totalJobs = await Job.countDocuments()
        const totalApplications = await Application.countDocuments()

        const recentActivity = {
          newUsers: await User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          }),
          newJobs: await Job.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          }),
          newApplications: await Application.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          }),
        }

        return successResponse({
          type: "overview",
          totals: {
            users: totalUsers,
            jobs: totalJobs,
            applications: totalApplications,
          },
          recentActivity,
        })
    }
  } catch (error) {
    return handleApiError(error)
  }
}

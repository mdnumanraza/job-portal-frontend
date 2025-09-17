import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { handleApiError, successResponse } from "@/utils/errorHandler"
import Joi from "joi"

const experienceSchema = Joi.object({
  title: Joi.string().required(),
  company: Joi.string().required(),
  duration: Joi.string().required(),
  description: Joi.string().required(),
})

const experienceUpdateSchema = Joi.object({
  experience: Joi.array().items(experienceSchema).required(),
})

// PUT /api/users/me/experience - Update all experience entries
export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const body = await request.json()

    // Validate input
    const { error, value } = experienceUpdateSchema.validate(body)
    if (error) {
      return handleApiError({
        name: "ValidationError",
        details: error.details,
      })
    }

    // Update user experience
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { experience: value.experience },
      { new: true, runValidators: true },
    ).select("experience")

    return successResponse(
      {
        experience: updatedUser.experience,
      },
      "Experience updated successfully",
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/users/me/experience - Add experience entry
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const body = await request.json()

    // Validate input
    const { error, value } = experienceSchema.validate(body)
    if (error) {
      return handleApiError({
        name: "ValidationError",
        details: error.details,
      })
    }

    // Add experience entry
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { experience: value } },
      { new: true, runValidators: true },
    ).select("experience")

    return successResponse(
      {
        experience: updatedUser.experience,
      },
      "Experience entry added successfully",
    )
  } catch (error) {
    return handleApiError(error)
  }
}

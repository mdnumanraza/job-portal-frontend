import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { handleApiError, successResponse } from "@/utils/errorHandler"
import Joi from "joi"

const educationSchema = Joi.object({
  degree: Joi.string().required(),
  institution: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(1950)
    .max(new Date().getFullYear() + 10)
    .required(),
})

const educationUpdateSchema = Joi.object({
  education: Joi.array().items(educationSchema).required(),
})

// PUT /api/users/me/education - Update all education entries
export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const body = await request.json()

    // Validate input
    const { error, value } = educationUpdateSchema.validate(body)
    if (error) {
      return handleApiError({
        name: "ValidationError",
        details: error.details,
      })
    }

    // Update user education
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { education: value.education },
      { new: true, runValidators: true },
    ).select("education")

    return successResponse(
      {
        education: updatedUser.education,
      },
      "Education updated successfully",
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/users/me/education - Add education entry
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const body = await request.json()

    // Validate input
    const { error, value } = educationSchema.validate(body)
    if (error) {
      return handleApiError({
        name: "ValidationError",
        details: error.details,
      })
    }

    // Add education entry
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { education: value } },
      { new: true, runValidators: true },
    ).select("education")

    return successResponse(
      {
        education: updatedUser.education,
      },
      "Education entry added successfully",
    )
  } catch (error) {
    return handleApiError(error)
  }
}

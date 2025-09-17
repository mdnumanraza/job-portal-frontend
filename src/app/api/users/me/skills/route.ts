import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { handleApiError, successResponse } from "@/utils/errorHandler"
import Joi from "joi"

const skillsSchema = Joi.object({
  skills: Joi.array().items(Joi.string().trim().min(1)).required(),
})

// PUT /api/users/me/skills - Update user skills
export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const body = await request.json()

    // Validate input
    const { error, value } = skillsSchema.validate(body)
    if (error) {
      return handleApiError({
        name: "ValidationError",
        details: error.details,
      })
    }

    // Update user skills
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { skills: value.skills },
      { new: true, runValidators: true },
    ).select("skills")

    return successResponse(
      {
        skills: updatedUser.skills,
      },
      "Skills updated successfully",
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/users/me/skills - Add a skill
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const body = await request.json()

    const { skill } = body

    if (!skill || typeof skill !== "string" || skill.trim().length === 0) {
      return handleApiError({
        message: "Valid skill is required",
        statusCode: 400,
      })
    }

    // Add skill to user (avoid duplicates)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { skills: skill.trim() } },
      { new: true, runValidators: true },
    ).select("skills")

    return successResponse(
      {
        skills: updatedUser.skills,
      },
      "Skill added successfully",
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/users/me/skills - Remove a skill
export async function DELETE(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    const { searchParams } = new URL(request.url)
    const skill = searchParams.get("skill")

    if (!skill) {
      return handleApiError({
        message: "Skill parameter is required",
        statusCode: 400,
      })
    }

    // Remove skill from user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { skills: skill } },
      { new: true, runValidators: true },
    ).select("skills")

    return successResponse(
      {
        skills: updatedUser.skills,
      },
      "Skill removed successfully",
    )
  } catch (error) {
    return handleApiError(error)
  }
}

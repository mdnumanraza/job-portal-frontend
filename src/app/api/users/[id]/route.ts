import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { handleApiError, successResponse } from "@/utils/errorHandler"
import Joi from "joi"

// Validation schema for profile updates
const profileUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().optional(),
  location: Joi.string().optional(),
  organization: Joi.string().optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  education: Joi.array()
    .items(
      Joi.object({
        degree: Joi.string().required(),
        institution: Joi.string().required(),
        year: Joi.number()
          .integer()
          .min(1950)
          .max(new Date().getFullYear() + 10)
          .required(),
      }),
    )
    .optional(),
  experience: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        company: Joi.string().required(),
        duration: Joi.string().required(),
        description: Joi.string().required(),
      }),
    )
    .optional(),
  resume: Joi.string().optional(),
  profileImage: Joi.string().optional(),
})

// GET /api/users/[id] - Get user profile
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const currentUserId = request.headers.get("x-user-id")
    const currentUserRole = request.headers.get("x-user-role")

    // Users can view their own profile, employers can view applicant profiles, admins can view any profile
    const canViewProfile = currentUserId === params.id || currentUserRole === "admin" || currentUserRole === "employer"

    if (!canViewProfile) {
      return handleApiError({
        message: "You don't have permission to view this profile",
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

    // If viewing someone else's profile and not admin, limit the information shown
    if (currentUserId !== params.id && currentUserRole !== "admin") {
      const limitedProfile = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        organization: user.organization,
        skills: user.skills,
        education: user.education,
        experience: user.experience,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      }
      return successResponse(limitedProfile)
    }

    return successResponse({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      organization: user.organization,
      skills: user.skills,
      education: user.education,
      experience: user.experience,
      resume: user.resume,
      profileImage: user.profileImage,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/users/[id] - Update user profile
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const currentUserId = request.headers.get("x-user-id")
    const currentUserRole = request.headers.get("x-user-role")

    // Users can only update their own profile, admins can update any profile
    if (currentUserId !== params.id && currentUserRole !== "admin") {
      return handleApiError({
        message: "You can only update your own profile",
        statusCode: 403,
      })
    }

    const body = await request.json()

    // Validate input
    const { error, value } = profileUpdateSchema.validate(body)
    if (error) {
      return handleApiError({
        name: "ValidationError",
        details: error.details,
      })
    }

    // Check if user exists
    const user = await User.findById(params.id)
    if (!user) {
      return handleApiError({
        message: "User not found",
        statusCode: 404,
      })
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(params.id, value, {
      new: true,
      runValidators: true,
    }).select("-password")

    return successResponse(
      {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        location: updatedUser.location,
        organization: updatedUser.organization,
        skills: updatedUser.skills,
        education: updatedUser.education,
        experience: updatedUser.experience,
        resume: updatedUser.resume,
        profileImage: updatedUser.profileImage,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
      "Profile updated successfully",
    )
  } catch (error) {
    return handleApiError(error)
  }
}

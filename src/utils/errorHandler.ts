import { NextResponse } from "next/server"

export interface ApiError extends Error {
  statusCode?: number
}

export const createError = (message: string, statusCode = 400): ApiError => {
  const error = new Error(message) as ApiError
  error.statusCode = statusCode
  return error
}

export const handleApiError = (error: any) => {
  console.error("API Error:", error)

  if (error.name === "ValidationError") {
    return NextResponse.json(
      {
        success: false,
        message: "Validation Error",
        errors: Object.values(error.details || {}).map((err: any) => err.message),
      },
      { status: 400 },
    )
  }

  if (error.code === 11000) {
    return NextResponse.json(
      {
        success: false,
        message: "Duplicate entry found",
        error: "Resource already exists",
      },
      { status: 409 },
    )
  }

  const statusCode = error.statusCode || 500
  const message = error.message || "Internal Server Error"

  return NextResponse.json(
    {
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    },
    { status: statusCode },
  )
}

export const successResponse = (data: any, message = "Success", statusCode = 200) => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: statusCode },
  )
}

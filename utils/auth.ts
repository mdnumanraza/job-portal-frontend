import bcrypt from "bcryptjs"
import type { NextRequest } from "next/server"
import { verifyAccessToken } from "./jwt"

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const getTokenFromRequest = (request: NextRequest): string | null => {
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  // Also check cookies
  const token = request.cookies.get("accessToken")?.value
  return token || null
}

export const getUserFromToken = (request: NextRequest) => {
  try {
    const token = getTokenFromRequest(request)
    if (!token) return null

    return verifyAccessToken(token)
  } catch (error) {
    return null
  }
}

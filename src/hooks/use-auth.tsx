"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "applicant" | "employer" | "admin"
  phone?: string
  location?: string
  organization?: string
  skills?: string[]
  education?: Array<{
    degree: string
    institution: string
    year: number
  }>
  experience?: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  resume?: string
  profileImage?: string
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    setUser(data.data.user)
  }

  const signup = async (userData: any) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Signup failed")
    }

    setUser(data.data.user)
  }

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    })
    setUser(null)
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

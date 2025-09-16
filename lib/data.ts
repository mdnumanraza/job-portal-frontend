import jobsData from "@/data/jobs.json"
import usersData from "@/data/users.json"
import applicationsData from "@/data/applications.json"
import langData from "@/data/lang.json"

export interface Job {
  id: string
  title: string
  employer: string
  location: string
  category: "imam" | "teacher" | "helper" | "online tutor"
  type: "full-time" | "part-time" | "remote"
  salary: string
  description: string
  requirements: string[]
  applicationStatus: "open" | "closed"
  featured: boolean
  postedDate: string
  employerId: string
}

export interface User {
  id: string
  name: string
  email: string
  type: "applicant" | "employer"
  profile: {
    experience?: string
    education?: string
    skills?: string[]
    location?: string
    companySize?: string
    industry?: string
  }
}

export interface Application {
  id: string
  jobId: string
  userId: string
  status: "applied" | "under review" | "accepted" | "rejected"
  appliedDate: string
  coverLetter: string
  resume: string
}

export interface Language {
  [key: string]: {
    [section: string]: {
      [key: string]: string
    }
  }
}

export const jobs: Job[] = jobsData
export const users: User[] = usersData
export const applications: Application[] = applicationsData
export const languages: Language = langData

// Helper functions
export function getJobById(id: string): Job | undefined {
  return jobs.find((job) => job.id === id)
}

export function getFeaturedJobs(): Job[] {
  return jobs.filter((job) => job.featured)
}

export function getJobsByCategory(category: string): Job[] {
  if (category === "all") return jobs
  return jobs.filter((job) => job.category === category)
}

export function getJobsByType(type: string): Job[] {
  if (type === "all") return jobs
  return jobs.filter((job) => job.type === type)
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function getApplicationsByUserId(userId: string): Application[] {
  return applications.filter((app) => app.userId === userId)
}

export function getApplicationsByJobId(jobId: string): Application[] {
  return applications.filter((app) => app.jobId === jobId)
}

export function getJobsByEmployerId(employerId: string): Job[] {
  return jobs.filter((job) => job.employerId === employerId)
}

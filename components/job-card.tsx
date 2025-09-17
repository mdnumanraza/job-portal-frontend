"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, Building2 } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface Job {
  _id: string
  title: string
  description: string
  requirements: string[]
  location: string
  category: "imam" | "teacher" | "tutor" | "helper"
  salary: number | "Not disclosed"
  jobType: "full-time" | "part-time" | "contract" | "remote"
  postedBy: {
    _id: string
    name: string
    companyName?: string
    location?: string
  }
  status: "active" | "closed" | "draft"
  applicationsCount: number
  createdAt: string
  updatedAt: string
}

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const { t } = useLanguage()

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "imam":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
      case "teacher":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300"
      case "tutor":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300"
      case "helper":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
      case "part-time":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
      case "remote":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300"
      case "contract":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const formatSalary = (salary: number | "Not disclosed") => {
    if (salary === "Not disclosed") return salary
    return `$${salary.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/20 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{job.postedBy.companyName || job.postedBy.name}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground ml-2">{formatDate(job.createdAt)}</div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{formatSalary(job.salary)}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="capitalize">{job.jobType.replace("-", " ")}</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{job.description}</p>

          <div className="flex flex-wrap gap-2">
            <Badge className={getCategoryColor(job.category)}>{t("categories", job.category)}</Badge>
            <Badge variant="outline" className={getTypeColor(job.jobType)}>
              {t("jobs", job.jobType.replace("-", ""))}
            </Badge>
          </div>

          {job.applicationsCount > 0 && (
            <div className="text-xs text-muted-foreground">
              {job.applicationsCount} application{job.applicationsCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href={`/jobs/${job._id}`}>View Details</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href={`/jobs/${job._id}/apply`}>{t("jobs", "applyNow")}</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

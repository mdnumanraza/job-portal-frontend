"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign } from "lucide-react"
import type { Job } from "@/lib/data"
import { useLanguage } from "@/hooks/use-language"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const { t } = useLanguage()

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "imam":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "teacher":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "helper":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      case "online tutor":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-emerald-100 text-emerald-800"
      case "part-time":
        return "bg-amber-100 text-amber-800"
      case "remote":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/20 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
              {job.title}
            </h3>
            <p className="text-muted-foreground font-medium">{job.employer}</p>
          </div>
          {job.featured && (
            <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
              Featured
            </Badge>
          )}
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
            <span className="truncate">{job.salary}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="capitalize">{job.type.replace("-", " ")}</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{job.description}</p>

          <div className="flex flex-wrap gap-2">
            <Badge className={getCategoryColor(job.category)}>{t("jobs", job.category.replace(" ", ""))}</Badge>
            <Badge variant="outline" className={getTypeColor(job.type)}>
              {job.type === "full-time"
                ? t("jobs", "fullTime")
                : job.type === "part-time"
                  ? t("jobs", "partTime")
                  : t("jobs", "remote")}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href={`/jobs/${job.id}`}>{t("jobs", "viewDetails")}</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href={`/jobs/${job.id}/apply`}>{t("jobs", "applyNow")}</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

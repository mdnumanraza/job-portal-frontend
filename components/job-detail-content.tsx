"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar, Building, CheckCircle } from "lucide-react"
import type { Job } from "@/lib/data"
import { useLanguage } from "@/hooks/use-language"

interface JobDetailContentProps {
  job: Job
}

export function JobDetailContent({ job }: JobDetailContentProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/jobs" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common", "back")} to Jobs
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl text-balance">{job.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground">
                    <Building className="h-4 w-4 mr-2" />
                    <span className="font-medium">{job.employer}</span>
                  </div>
                </div>
                {job.featured && (
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                    Featured
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="capitalize">{job.type.replace("-", " ")}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Posted {formatDate(job.postedDate)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className={getCategoryColor(job.category)}>{t("jobs", job.category.replace(" ", ""))}</Badge>
                <Badge variant="outline" className={getTypeColor(job.type)}>
                  {job.type === "full-time"
                    ? t("jobs", "fullTime")
                    : job.type === "part-time"
                      ? t("jobs", "partTime")
                      : t("jobs", "remote")}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    job.applicationStatus === "open"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }
                >
                  {job.applicationStatus === "open" ? "Open for Applications" : "Applications Closed"}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-card-foreground">
                <p className="leading-relaxed">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground leading-relaxed">{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Apply for this Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.applicationStatus === "open" ? (
                <>
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/jobs/${job.id}/apply`}>{t("jobs", "applyNow")}</Link>
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Ready to take the next step in your career?
                  </p>
                </>
              ) : (
                <>
                  <Button disabled className="w-full" size="lg">
                    Applications Closed
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    This position is no longer accepting applications.
                  </p>
                </>
              )}

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-card-foreground">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    Save Job
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    Share Job
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    Report Issue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About {job.employer}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Learn more about this organization and their mission in the Islamic community.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2 text-primary">
                View Employer Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

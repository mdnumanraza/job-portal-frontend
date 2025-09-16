"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, ExternalLink, Eye } from "lucide-react"
import type { Application, Job } from "@/lib/data"

interface ApplicationCardProps {
  application: Application
  job: Job
}

export function ApplicationCard({ application, job }: ApplicationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800"
      case "under review":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "applied":
        return "Applied"
      case "under review":
        return "Under Review"
      case "accepted":
        return "Accepted"
      case "rejected":
        return "Rejected"
      default:
        return status
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground mb-1">{job.title}</h3>
            <p className="text-muted-foreground font-medium">{job.employer}</p>
          </div>
          <Badge className={getStatusColor(application.status)}>{getStatusText(application.status)}</Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Applied {formatDate(application.appliedDate)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{job.category}</Badge>
            <Badge variant="outline" className="capitalize">
              {job.type.replace("-", " ")}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="bg-transparent">
              <Link href={`/jobs/${job.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View Job
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              <ExternalLink className="h-4 w-4 mr-1" />
              Details
            </Button>
          </div>
        </div>

        {application.status === "under review" && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Your application is being reviewed. We'll notify you of any updates.
            </p>
          </div>
        )}

        {application.status === "accepted" && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              Congratulations! Your application has been accepted. Check your email for next steps.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

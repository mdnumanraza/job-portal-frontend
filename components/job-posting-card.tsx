"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MapPin, Calendar, Users, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import type { Job } from "@/lib/data"

interface JobPostingCardProps {
  job: Job
  applicationsCount: number
}

export function JobPostingCard({ job, applicationsCount }: JobPostingCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    return status === "open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground mb-1">{job.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Posted {formatDate(job.postedDate)}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>
                  {applicationsCount} applicant{applicationsCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(job.applicationStatus)}>
              {job.applicationStatus === "open" ? "Open" : "Closed"}
            </Badge>
            {job.featured && (
              <Badge variant="secondary" className="bg-secondary/20">
                Featured
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/jobs/${job.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Job
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Job
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{job.category}</Badge>
            <Badge variant="outline" className="capitalize">
              {job.type.replace("-", " ")}
            </Badge>
            <span className="text-sm text-muted-foreground">{job.salary}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-transparent">
              <Users className="h-4 w-4 mr-1" />
              View Applicants
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

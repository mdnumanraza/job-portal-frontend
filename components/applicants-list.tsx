"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getJobsByEmployerId, getApplicationsByJobId, getUserById, getJobById } from "@/lib/data"
import { Mail, Calendar, FileText, CheckCircle, X } from "lucide-react"

interface ApplicantsListProps {
  employerId: string
}

export function ApplicantsList({ employerId }: ApplicantsListProps) {
  const employerJobs = getJobsByEmployerId(employerId)

  // Get all applications for employer's jobs
  const allApplications = employerJobs.flatMap((job) =>
    getApplicationsByJobId(job.id).map((app) => ({
      ...app,
      job: getJobById(app.jobId),
      applicant: getUserById(app.userId),
    })),
  )

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Applicants</CardTitle>
        <p className="text-muted-foreground">Review and manage applications across all your job postings</p>
      </CardHeader>
      <CardContent>
        {allApplications.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
            <p className="text-muted-foreground">
              Applications will appear here once candidates start applying to your jobs.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {allApplications.map((application) => (
              <Card key={application.id} className="border-l-4 border-l-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {application.applicant?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-foreground">{application.applicant?.name}</h4>
                        <p className="text-sm text-muted-foreground mb-1">Applied for: {application.job?.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            <span>{application.applicant?.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Applied {formatDate(application.appliedDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>

                  {application.applicant?.profile && (
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-foreground">Experience:</span>
                          <p className="text-muted-foreground">
                            {application.applicant.profile.experience || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Education:</span>
                          <p className="text-muted-foreground">
                            {application.applicant.profile.education || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {application.applicant.profile.skills?.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            )) || <span className="text-muted-foreground">None listed</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h5 className="font-medium text-foreground mb-2">Cover Letter:</h5>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {application.coverLetter}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <FileText className="h-4 w-4 mr-1" />
                        View Resume
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Mail className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </div>

                    {application.status === "applied" && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

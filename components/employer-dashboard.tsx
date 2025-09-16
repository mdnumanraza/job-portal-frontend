"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobPostingCard } from "./job-posting-card"
import { ApplicantsList } from "./applicants-list"
import { PostJobForm } from "./post-job-form"
import { getJobsByEmployerId, getApplicationsByJobId, getUserById } from "@/lib/data"
import { useLanguage } from "@/hooks/use-language"
import { Briefcase, Users, Eye, Plus } from "lucide-react"
import { useState } from "react"

export function EmployerDashboard() {
  const { t } = useLanguage()
  const [showPostJobForm, setShowPostJobForm] = useState(false)

  // Mock current employer - in a real app, this would come from authentication
  const currentEmployerId = "emp1"
  const currentEmployer = getUserById(currentEmployerId)
  const employerJobs = getJobsByEmployerId(currentEmployerId)

  // Calculate statistics
  const totalApplications = employerJobs.reduce((total, job) => {
    return total + getApplicationsByJobId(job.id).length
  }, 0)

  const activeJobs = employerJobs.filter((job) => job.applicationStatus === "open").length
  const totalViews = employerJobs.length * 150 // Mock view count

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {currentEmployer?.name}!</h1>
            <p className="text-muted-foreground">Manage your job postings and review applications</p>
          </div>
          <Button onClick={() => setShowPostJobForm(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold text-foreground">{activeJobs}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-foreground">{totalApplications}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-foreground">{totalViews}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs">My Job Postings</TabsTrigger>
          <TabsTrigger value="applicants">All Applicants</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Job Postings</CardTitle>
                <Button variant="outline" onClick={() => setShowPostJobForm(true)} className="bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Button>
              </div>
              <p className="text-muted-foreground">Manage your active and closed job postings</p>
            </CardHeader>
            <CardContent>
              {employerJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No job postings yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first job posting to start receiving applications.
                  </p>
                  <Button onClick={() => setShowPostJobForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Job
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {employerJobs.map((job) => {
                    const applications = getApplicationsByJobId(job.id)
                    return <JobPostingCard key={job.id} job={job} applicationsCount={applications.length} />
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applicants" className="space-y-6">
          <ApplicantsList employerId={currentEmployerId} />
        </TabsContent>
      </Tabs>

      {showPostJobForm && <PostJobForm onClose={() => setShowPostJobForm(false)} employerId={currentEmployerId} />}
    </div>
  )
}

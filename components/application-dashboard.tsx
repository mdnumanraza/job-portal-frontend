"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApplicationCard } from "./application-card"
import { ProfileSettings } from "./profile-settings"
import { SavedJobs } from "./saved-jobs"
import { applications, getJobById, getUserById } from "@/lib/data"
import { useLanguage } from "@/hooks/use-language"
import { User, Briefcase, Heart, Settings } from "lucide-react"

export function ApplicationDashboard() {
  const { t } = useLanguage()
  // Mock current user - in a real app, this would come from authentication
  const currentUserId = "user1"
  const currentUser = getUserById(currentUserId)
  const userApplications = applications.filter((app) => app.userId === currentUserId)

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

  const statusCounts = {
    applied: userApplications.filter((app) => app.status === "applied").length,
    underReview: userApplications.filter((app) => app.status === "under review").length,
    accepted: userApplications.filter((app) => app.status === "accepted").length,
    rejected: userApplications.filter((app) => app.status === "rejected").length,
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {currentUser?.name}!</h1>
        <p className="text-muted-foreground">Track your applications and manage your job search</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-foreground">{userApplications.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold text-foreground">{statusCounts.underReview}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold text-foreground">{statusCounts.accepted}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {userApplications.length > 0
                    ? Math.round(((statusCounts.accepted + statusCounts.rejected) / userApplications.length) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application History</CardTitle>
              <p className="text-muted-foreground">Track the status of all your job applications</p>
            </CardHeader>
            <CardContent>
              {userApplications.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-6">Start applying to jobs to see your applications here.</p>
                  <Button asChild>
                    <a href="/jobs">Browse Jobs</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userApplications.map((application) => {
                    const job = getJobById(application.jobId)
                    if (!job) return null

                    return <ApplicationCard key={application.id} application={application} job={job} />
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <SavedJobs />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings user={currentUser} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

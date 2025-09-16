"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { JobCard } from "./job-card"
import { getFeaturedJobs } from "@/lib/data"
import { Heart } from "lucide-react"

export function SavedJobs() {
  // Mock saved jobs - in a real app, this would come from user preferences
  const savedJobs = getFeaturedJobs().slice(0, 2)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Jobs</CardTitle>
        <p className="text-muted-foreground">Jobs you've bookmarked for later</p>
      </CardHeader>
      <CardContent>
        {savedJobs.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No saved jobs yet</h3>
            <p className="text-muted-foreground mb-6">Save jobs you're interested in to easily find them later.</p>
            <Button asChild>
              <a href="/jobs">Browse Jobs</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

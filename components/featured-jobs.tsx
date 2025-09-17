"use client"

import { useState, useEffect } from "react"
import { JobCard } from "./job-card"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

export function FeaturedJobs() {
  const { t } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await fetch("/api/jobs?limit=6&featured=true")
        if (response.ok) {
          const data = await response.json()
          setJobs(data.data.jobs || [])
        }
      } catch (error) {
        console.error("Error fetching featured jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedJobs()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("jobs", "featured")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the most sought-after positions in Islamic education and community service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{t("jobs", "featured")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the most sought-after positions in Islamic education and community service
          </p>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("jobs", "noJobs")}</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/jobs">View All Jobs</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

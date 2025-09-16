"use client"

import { JobCard } from "./job-card"
import { getFeaturedJobs } from "@/lib/data"
import { useLanguage } from "@/hooks/use-language"

export function FeaturedJobs() {
  const { t } = useLanguage()
  const featuredJobs = getFeaturedJobs()

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{t("hero", "featuredJobs")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the most sought-after positions in Islamic education and community service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/jobs"
            className="inline-flex items-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg font-medium transition-colors"
          >
            View All Jobs
          </a>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useMemo } from "react"
import { JobCard } from "./job-card"
import { JobFilters } from "./job-filters"
import { jobs } from "@/lib/data"
import type { Job } from "@/lib/data"
import { useLanguage } from "@/hooks/use-language"

export function JobList() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("")

  const filteredJobs = useMemo(() => {
    return jobs.filter((job: Job) => {
      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || job.category === selectedCategory

      const matchesType = selectedType === "all" || job.type === selectedType

      const matchesLocation = !selectedLocation || job.location.toLowerCase().includes(selectedLocation.toLowerCase())

      return matchesSearch && matchesCategory && matchesType && matchesLocation
    })
  }, [searchTerm, selectedCategory, selectedType, selectedLocation])

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedType("all")
    setSelectedLocation("")
  }

  return (
    <div className="space-y-6">
      <JobFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onClearFilters={handleClearFilters}
      />

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground">
          {filteredJobs.length === 0
            ? t("common", "noResults")
            : `${filteredJobs.length} ${filteredJobs.length === 1 ? t("jobs", "jobFound") : t("jobs", "jobsFound")}`}
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-4">{t("common", "noResults")}</div>
          <p className="text-muted-foreground mb-6">{t("common", "tryAdjusting")}</p>
          <button onClick={handleClearFilters} className="text-primary hover:text-primary/80 font-medium underline">
            {t("common", "clearAllFilters")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}

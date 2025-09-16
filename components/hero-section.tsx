"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function HeroSection() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = () => {
    // Navigate to jobs page with search parameters
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (location) params.set("location", location)
    window.location.href = `/jobs?${params.toString()}`
  }

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            {t("hero", "title")}
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">{t("hero", "subtitle")}</p>

          <div className="mt-10 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-card rounded-lg shadow-lg border">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t("hero", "searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-0 bg-background focus-visible:ring-1"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t("hero", "locationPlaceholder")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 border-0 bg-background focus-visible:ring-1"
                />
              </div>
              <Button onClick={handleSearch} className="px-8">
                {t("hero", "searchButton")}
              </Button>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">{t("hero", "stats.activeJobs")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">{t("hero", "stats.jobSeekers")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">{t("hero", "stats.employers")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Filter, X } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface JobFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedType: string
  setSelectedType: (type: string) => void
  selectedLocation: string
  setSelectedLocation: (location: string) => void
  onClearFilters: () => void
}

export function JobFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  selectedLocation,
  setSelectedLocation,
  onClearFilters,
}: JobFiltersProps) {
  const { t } = useLanguage()

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedType !== "all" || selectedLocation

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          {t("jobs", "filterBy")}
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            {t("common", "clearAll")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={t("hero", "searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder={t("jobs", "allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("jobs", "allCategories")}</SelectItem>
            <SelectItem value="imam">{t("jobs", "imam")}</SelectItem>
            <SelectItem value="teacher">{t("jobs", "teacher")}</SelectItem>
            <SelectItem value="helper">{t("jobs", "helper")}</SelectItem>
            <SelectItem value="online tutor">{t("jobs", "onlineTutor")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder={t("jobs", "allTypes")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("jobs", "allTypes")}</SelectItem>
            <SelectItem value="full-time">{t("jobs", "fullTime")}</SelectItem>
            <SelectItem value="part-time">{t("jobs", "partTime")}</SelectItem>
            <SelectItem value="remote">{t("jobs", "remote")}</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder={t("hero", "locationPlaceholder")}
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        />
      </div>
    </div>
  )
}

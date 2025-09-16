"use client"

import { useState, useEffect } from "react"
import { languages } from "@/lib/data"

export type SupportedLanguage = "en" | "hi" | "ur"

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as SupportedLanguage
    if (savedLanguage && ["en", "hi", "ur"].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (section: string, key: string): string => {
    return languages[currentLanguage]?.[section]?.[key] || key
  }

  return {
    currentLanguage,
    changeLanguage,
    t,
    languages: ["en", "hi", "ur"] as SupportedLanguage[],
  }
}

"use client"

import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">J</span>
              </div>
              <span className="font-bold text-xl text-foreground">JobPortal</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{t("footer", "description")}</p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer", "quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t("nav", "home")}
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t("nav", "jobs")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t("nav", "dashboard")}
                </Link>
              </li>
              <li>
                <Link href="/employer" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t("nav", "employer")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer", "categories")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/jobs?category=imam"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {t("jobs", "imam")}
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?category=teacher"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {t("jobs", "teacher")}
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?category=helper"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {t("jobs", "helper")}
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?category=online%20tutor"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {t("jobs", "onlineTutor")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer", "support")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t("footer", "aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t("footer", "contact")}
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t("footer", "helpCenter")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t("footer", "privacyPolicy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">{t("footer", "copyright")}</p>
        </div>
      </div>
    </footer>
  )
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Menu } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function Navbar() {
  const { currentLanguage, changeLanguage, t, languages } = useLanguage()

  const languageNames = {
    en: "English",
    hi: "हिंदी",
    ur: "اردو",
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">J</span>
              </div>
              <span className="font-bold text-xl text-foreground">JobPortal</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t("nav", "home")}
              </Link>
              <Link
                href="/jobs"
                className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t("nav", "jobs")}
              </Link>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t("nav", "dashboard")}
              </Link>
              <Link
                href="/employer"
                className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t("nav", "employer")}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  {languageNames[currentLanguage]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={currentLanguage === lang ? "bg-accent" : ""}
                  >
                    {languageNames[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                {t("nav", "login")}
              </Button>
              <Button size="sm">{t("nav", "register")}</Button>
            </div>

            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/">{t("nav", "home")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/jobs">{t("nav", "jobs")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">{t("nav", "dashboard")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/employer">{t("nav", "employer")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/login">{t("nav", "login")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">{t("nav", "register")}</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

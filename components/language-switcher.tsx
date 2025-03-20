"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useTranslation } from "@/lib/i18n/client"

interface LanguageSwitcherProps {
  inSidePanel?: boolean
  isCompact?: boolean
}

export default function LanguageSwitcher({ inSidePanel = false, isCompact = false }: LanguageSwitcherProps) {
  const router = useRouter()
  const { t, locale, setLocale } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const changeLanguage = (newLocale: string) => {
    setLocale(newLocale)

    // Store the language preference
    localStorage.setItem("language", newLocale)

    // Refresh the page to apply translations
    router.refresh()
  }

  if (inSidePanel) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="font-medium">{t("changeLanguage")}</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={locale === "ro" ? "default" : "outline"}
            className={locale === "ro" ? "bg-primary" : ""}
            onClick={() => changeLanguage("ro")}
            size="sm"
          >
            Română
          </Button>
          <Button
            variant={locale === "en" ? "default" : "outline"}
            className={locale === "en" ? "bg-primary" : ""}
            onClick={() => changeLanguage("en")}
            size="sm"
          >
            English
          </Button>
        </div>
      </div>
    )
  }

  if (isCompact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Globe className="h-4 w-4" />
            <span className="sr-only">{t("changeLanguage")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[100px]">
          <DropdownMenuItem onClick={() => changeLanguage("ro")} className={locale === "ro" ? "bg-muted" : ""}>
            Română
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("en")} className={locale === "en" ? "bg-muted" : ""}>
            English
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="bg-background/70 backdrop-blur-sm hover:bg-background/90">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t("changeLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("ro")} className={locale === "ro" ? "bg-muted" : ""}>
          Română
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("en")} className={locale === "en" ? "bg-muted" : ""}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


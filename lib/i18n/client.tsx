"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { en } from "./locales/en"
import { ro } from "./locales/ro"

type Translations = typeof en
type TranslationKey = keyof Translations

interface I18nContextType {
  t: (key: string) => string
  locale: string
  setLocale: (locale: string) => void
}

const I18nContext = createContext<I18nContextType | null>(null)

const translations: Record<string, Translations> = {
  en,
  ro,
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState("ro") // Default to Romanian

  useEffect(() => {
    // Always use Romanian
    setLocale("ro")
  }, [])

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[locale]

    for (const k of keys) {
      if (value === undefined) return key
      value = value[k]
    }

    return value || key
  }

  return <I18nContext.Provider value={{ t, locale, setLocale }}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider")
  }

  return context
}


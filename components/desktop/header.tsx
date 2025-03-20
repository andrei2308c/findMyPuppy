"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { PawPrint, Search, Heart, Users, Mail, Gift, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/client"
import LanguageSwitcher from "@/components/language-switcher"

export default function DesktopHeader() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const navigation = [
    { name: t("menu.home.tabName"), href: "/", icon: Search },
    { name: t("menu.about.tabName"), href: "/about", icon: Users },
    { name: t("menu.contact.tabName"), href: "/contact", icon: Mail },
    { name: t("menu.support.tabName"), href: "/support", icon: Gift },
    { name: "Blog", href: "/blog", icon: Heart },
  ]

  return (
    <header className="sticky top-0 z-50">
      <div className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-lg">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                {t("appName")}
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href} className="relative px-3 py-2 rounded-md group">
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 rounded-md z-0"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                    <span
                      className={`relative z-10 flex items-center gap-1.5 text-sm font-medium ${
                        isActive
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-300"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </span>
                  </Link>
                )
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher isCompact={true} />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                {t("addLostPet")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDesktop } from "@/hooks/use-desktop"
import DesktopHeader from "./header"
import DesktopFooter from "./footer"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface DesktopLayoutProps {
  children: React.ReactNode
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const isDesktop = useDesktop()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Only render desktop layout on desktop screens
  if (!isDesktop) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <DesktopHeader />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 py-8"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <DesktopFooter />
    </div>
  )
}


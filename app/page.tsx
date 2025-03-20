"use client"

import { useDesktop } from "@/hooks/use-desktop"
import DesktopLayout from "@/components/desktop/layout"
import HeroSection from "@/components/desktop/hero-section"
import FeaturesSection from "@/components/desktop/features-section"
import StatsSection from "@/components/desktop/stats-section"
import TestimonialsSection from "@/components/desktop/testimonials-section"
import BlogPreviewSection from "@/components/desktop/blog-preview-section"
import CtaSection from "@/components/desktop/cta-section"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useTranslation } from "@/lib/i18n/client"
import { homeData } from "@/lib/data/home-data"
import MobilePromptModal from "@/components/mobile-prompt-modal"

// Dynamically import the mobile app
const MobileApp = dynamic(
  () =>
    import("@/components/map-component").then((mod) => {
      return () => (
        <div className="relative w-full h-[100dvh] overflow-hidden">
          <mod.default />
        </div>
      )
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-[100dvh] bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    ),
  },
)

export default function Home() {
  const isDesktop = useDesktop()
  const [mounted, setMounted] = useState(false)
  const [showMobilePrompt, setShowMobilePrompt] = useState(false)
  const { locale } = useTranslation()

  // Get localized content
  const content = homeData[locale as keyof typeof homeData] || homeData.en

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Show mobile app on mobile devices
  if (!isDesktop) {
    return <MobileApp />
  }

  // Show desktop landing page on desktop
  return (
    <DesktopLayout>
      <HeroSection content={content.hero} />
      <FeaturesSection content={content.features} />
      <StatsSection content={content.stats} />
      {/* <TestimonialsSection content={content.testimonials} /> */}
      <BlogPreviewSection />
      <CtaSection content={content.cta} onGetStarted={() => setShowMobilePrompt(true)} />

      <MobilePromptModal
        isOpen={showMobilePrompt}
        onClose={() => setShowMobilePrompt(false)}
        title={content.cta.mobilePrompt.title}
        description={content.cta.mobilePrompt.description}
        closeButtonText={content.cta.mobilePrompt.closeButton}
      />
    </DesktopLayout>
  )
}


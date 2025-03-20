"use client"

import type React from "react"

import { useDesktop } from "@/hooks/use-desktop"
import { MapProvider } from "@/lib/contexts/MapContext"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import LocationPrompt from "@/components/location-prompt"

// Dynamically import the mobile app component
const MobileApp = dynamic(() => import("@/components/mobile-app"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-[100dvh] bg-background">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
})

interface RootWrapperProps {
  children: React.ReactNode
}

export default function RootWrapper({ children }: RootWrapperProps) {
  const isDesktop = useDesktop()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if we need to show location prompt
    const storedPermission = localStorage.getItem("locationPermission")
    if (storedPermission === null) {
      setShowLocationPrompt(true)
    }
  }, [])

  const handleLocationResponse = (granted: boolean) => {
    localStorage.setItem("locationPermission", granted ? "granted" : "denied")
    setShowLocationPrompt(false)
  }

  // Don't render anything until we know if we're on desktop or mobile
  if (!mounted || isDesktop === null) {
    return (
      <div className="flex items-center justify-center w-full h-[100dvh] bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <MapProvider>
      {showLocationPrompt && <LocationPrompt onResponse={handleLocationResponse} />}

      {!isDesktop ? <MobileApp /> : children}
    </MapProvider>
  )
}


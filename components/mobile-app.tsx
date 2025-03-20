"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import SidePanel from "@/components/side-panel"
import AddPinModal from "@/components/add-pin-modal"
import LocationPrompt from "@/components/location-prompt"
import { useMapContext } from "@/lib/contexts/MapContext"
import { useTranslation } from "@/lib/i18n/client"
import NewPinNotification from "@/components/new-pin-notification"
import { useTheme } from "next-themes"

// Dynamically import the Map component
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-[100dvh] bg-background">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
})

export default function MobileApp() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const {
    mapMode,
    newPin,
    showNewPinNotification,
    dismissNewPinNotification,
    viewNewPin,
    userLocation,
    setUserLocation,
    isPinPlacementMode,
    setIsPinPlacementMode,
    draftPin,
  } = useMapContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAddPinModalOpen, setIsAddPinModalOpen] = useState(false)
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch with theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if we need to show the location prompt
  useEffect(() => {
    const storedPermission = localStorage.getItem("locationPermission")

    if (storedPermission === null) {
      // No stored permission, show the prompt
      setShowLocationPrompt(true)
    } else if (storedPermission === "granted" && !userLocation && navigator.geolocation) {
      // Permission granted but no location yet, request it
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords
          setUserLocation([longitude, latitude])
        },
        (error) => {
          console.error("Error getting location:", error)
        },
        { enableHighAccuracy: true },
      )
    }
  }, [userLocation, setUserLocation])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLocationPrompt = (granted: boolean) => {
    setShowLocationPrompt(false)

    // Store the permission
    localStorage.setItem("locationPermission", granted ? "granted" : "denied")

    if (granted && navigator.geolocation) {
      // Request location immediately
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords
          setUserLocation([longitude, latitude])
        },
        (error) => {
          console.error("Error getting location:", error)
        },
        { enableHighAccuracy: true },
      )
    }
  }

  // Handle returning from pin placement mode
  useEffect(() => {
    if (!isPinPlacementMode && draftPin) {
      // When pin placement is complete, open the add pin modal again
      setIsAddPinModalOpen(true)
    }
  }, [isPinPlacementMode, draftPin])

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden">
      {showLocationPrompt && <LocationPrompt onResponse={handleLocationPrompt} />}

      {/* Map Component */}
      <div className="absolute inset-0">
        <MapComponent />
      </div>

      {/* Shadow overlay for the map */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          mapMode === "lost" ? "bg-orange-500/10" : "bg-pink-400/10"
        } z-[5]`}
      ></div>

      {/* Top Left Menu Button with Language and Theme Toggles */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className={`h-12 w-12 rounded-full shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 ${
            mapMode === "lost" ? "text-orange-500 border border-orange-200" : "text-pink-400 border border-pink-200"
          }`}
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t("openMenu")}</span>
        </Button>

        {/* Language Switcher */}
      </div>

      {/* Add Pin Button */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          onClick={() => setIsAddPinModalOpen(true)}
          className={`rounded-full px-7 py-7 shadow-lg text-sm font-medium ${
            mapMode === "lost"
              ? "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white"
              : "bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500 text-white"
          }`}
        >
          {mapMode === "lost" ? t("addLostPet") : t("addFoundPet")}
        </Button>
      </div>

      {/* Side Panel */}
      <SidePanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Add Pin Modal */}
      <AddPinModal isOpen={isAddPinModalOpen} onClose={() => setIsAddPinModalOpen(false)} />

      {/* New Pin Notification */}
      {showNewPinNotification && newPin && (
        <NewPinNotification pin={newPin} onClose={dismissNewPinNotification} onView={viewNewPin} />
      )}
    </main>
  )
}


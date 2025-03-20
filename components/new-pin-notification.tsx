"use client"

import { useState, useEffect } from "react"
import { PawPrintIcon as Paw } from "lucide-react"
import { useTranslation } from "@/lib/i18n/client"
import type { PinData } from "@/lib/types"
import { useMapContext } from "@/lib/contexts/MapContext"

interface NewPinNotificationProps {
  pin: PinData
  onClose: () => void
  onView: () => void
}

export default function NewPinNotification({ pin, onClose, onView }: NewPinNotificationProps) {
  const { t } = useTranslation()
  const { mapMode, userLocation } = useMapContext()
  const [isVisible, setIsVisible] = useState(false)
  const [timeAgo, setTimeAgo] = useState<string>("")
  const [distance, setDistance] = useState<string>("")

  // Calculate time ago
  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date()
      const pinDate = new Date(pin.createdAt)
      const diffMs = now.getTime() - pinDate.getTime()
      const diffSec = Math.round(diffMs / 1000)

      if (diffSec < 60) {
        setTimeAgo(t("timeJustNow"))
      } else {
        setTimeAgo(t("timeJustNow")) // Fallback to "just now" for demo purposes
      }
    }

    calculateTimeAgo()
    const interval = setInterval(calculateTimeAgo, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [pin.createdAt, t])

  // Calculate distance
  useEffect(() => {
    if (userLocation) {
      const dist = calculateDistance(pin, userLocation)
      setDistance(formatDistance(dist))
    }
  }, [userLocation, pin])

  // Show notification with animation
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true)
    })

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for exit animation
  }

  // Update the handleClick function to properly center the map on the pin's location
  const handleClick = () => {
    // When notification is clicked, we want to:
    // 1. Switch to the appropriate mode
    // 2. Center the map on the pin's location
    // 3. Open the pin detail modal
    onView()
  }

  // Calculate distance between pin and user location
  const calculateDistance = (pin: PinData, loc: [number, number]): number => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(pin.latitude - loc[1])
    const dLon = deg2rad(pin.longitude - loc[0])
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(loc[1])) * Math.cos(deg2rad(pin.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  // Format distance for display
  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  // Determine if this is a potential match (opposite mode)
  const isPotentialMatch =
    (mapMode === "lost" && pin.id.includes("found")) || (mapMode === "found" && pin.id.includes("lost"))

  return (
    <div
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] cursor-pointer
        ${isVisible ? "translate-y-4 opacity-100" : "-translate-y-full opacity-0"}`}
      onClick={handleClick}
    >
      {/* iOS-style notification */}
      <div className="bg-[#1C1C1E]/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg border border-white/10">
        <div className="p-3 flex items-start gap-3">
          {/* App icon */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
            ${isPotentialMatch ? "bg-green-500" : mapMode === "lost" ? "bg-orange-500" : "bg-pink-400"}`}
          >
            <Paw className="h-6 w-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-0.5">
              <h3 className="font-semibold text-white">
                {isPotentialMatch ? t("newPinNotification.matchFound") : t("newPinNotification.newNearby")}
              </h3>
              <span className="text-xs text-gray-400">now</span>
            </div>
            <p className="text-sm text-white/90 mb-1">
              {pin.dogName} - {distance} {t("lostPetsList.away")}
            </p>
            <p className="text-xs text-white/70 line-clamp-1">{pin.description}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-800">
          <div
            className={`h-full ${isPotentialMatch ? "bg-green-500" : mapMode === "lost" ? "bg-orange-500" : "bg-pink-400"} 
              animate-shrink-width`}
            style={{ animationDuration: "5s" }}
          />
        </div>
      </div>
    </div>
  )
}


"use client"

import { useMapContext } from "@/lib/contexts/MapContext"
import { useTranslation } from "@/lib/i18n/client"
import { Badge } from "@/components/ui/badge"
import { PawPrintIcon as Paw, MapPin, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { PinData } from "@/lib/types"
import { useEffect } from "react"

interface NearbyPetsListProps {
  onPinClick?: () => void // Add this prop to handle sidebar closing
}

export default function NearbyPetsList({ onPinClick }: NearbyPetsListProps) {
  const { t } = useTranslation()
  const { nearbyPins, userLocation, mapMode, refreshPins, openPinDetailModal } = useMapContext()

  // Refresh pins when component mounts or user location changes
  useEffect(() => {
    if (userLocation) {
      console.log("User location available, refreshing pins")
      refreshPins()

      // Set up an interval to refresh every 10 seconds
      const intervalId = setInterval(() => {
        console.log("Refreshing pins on interval")
        refreshPins()
      }, 10000) // 10 seconds

      // Cleanup interval on unmount
      return () => clearInterval(intervalId)
    }
  }, [userLocation]) // Only depend on userLocation, not refreshPins

  // Format distance to user
  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  // Calculate distance between user and pin
  const calculateDistance = (pin: PinData): number => {
    if (!userLocation) return 0

    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(pin.latitude - userLocation[1])
    const dLon = deg2rad(pin.longitude - userLocation[0])
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(userLocation[1])) * Math.cos(deg2rad(pin.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.round(diffMs / 1000)
    const diffMin = Math.round(diffSec / 60)
    const diffHour = Math.round(diffMin / 60)
    const diffDay = Math.round(diffHour / 24)

    if (diffSec < 60) {
      return t("timeJustNow")
    } else if (diffMin < 60) {
      return `${diffMin} ${diffMin === 1 ? t("timeMinute") : t("timeMinutes")}`
    } else if (diffHour < 24) {
      return `${diffHour} ${diffHour === 1 ? t("timeHour") : t("timeHours")}`
    } else {
      return `${diffDay} ${diffDay === 1 ? t("timeDay") : t("timeDays")}`
    }
  }

  // Handle pin click
  const handlePinClick = (pin: PinData) => {
    if (pin) {
      // Pass true as the second parameter to force staying in current mode
      openPinDetailModal(pin, true)

      // Close the sidebar if onPinClick is provided
      if (onPinClick) {
        onPinClick()
      }
    }
  }

  console.log("Rendering NearbyPetsList with", nearbyPins.length, "pins")

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-orange-500">
          {mapMode === "lost" ? t("lostPetsList.title") : t("foundPetsList.title")}
        </h3>
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
          {nearbyPins.length} {nearbyPins.length === 1 ? t("lostPetsList.pet") : t("lostPetsList.pets")}
        </Badge>
      </div>

      {nearbyPins.length === 0 ? (
        <div className="p-8 text-center text-gray-500 flex flex-col items-center">
          <div className="bg-gray-100 p-4 rounded-full mb-3">
            <Paw className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium">
            {mapMode === "lost" ? t("lostPetsList.noPets") : t("foundPetsList.noPets")}
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] rounded-md border">
          <div className="p-2 space-y-2">
            {nearbyPins.map((pin) => (
              <div
                key={pin.id}
                className="p-3 bg-white hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-100 shadow-sm"
                onClick={() => handlePinClick(pin)}
              >
                <div className="flex flex-col">
                  {/* Distance indicator at the top if available */}
                  {userLocation && (
                    <div className="mb-2">
                      <Badge className="bg-orange-100 text-orange-700 border-0 flex items-center gap-1 px-2 py-1">
                        <MapPin className="h-3 w-3" />
                        <span className="font-medium">{formatDistance(calculateDistance(pin))}</span>
                        <span className="text-xs opacity-75">{t("lostPetsList.away")}</span>
                      </Badge>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                      {pin.photos && pin.photos.length > 0 ? (
                        <img
                          src={pin.photos[0] || "/placeholder.svg"}
                          alt={pin.dogName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-pink-100">
                          <Paw className="h-8 w-8 text-pink-400" />
                        </div>
                      )}
                      {pin.photos && pin.photos.length > 1 && (
                        <div className="absolute bottom-0.5 right-0.5 bg-black/50 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                          {pin.photos.length}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate text-gray-800">{pin.dogName}</h3>
                      <div className="flex flex-wrap gap-1 mt-0.5 mb-1">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1 py-0 h-4 ${
                            pin.gender === "Male"
                              ? "text-blue-600 border-blue-200 bg-blue-50"
                              : pin.gender === "Female"
                                ? "text-pink-600 border-pink-200 bg-pink-50"
                                : "text-gray-600 border-gray-200 bg-gray-50"
                          }`}
                        >
                          {pin.gender}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0 h-4 text-amber-600 border-amber-200 bg-amber-50"
                        >
                          {pin.size}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{pin.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0 h-4 gap-0.5 text-gray-600 border-gray-200 bg-gray-50"
                        >
                          <Clock className="h-2.5 w-2.5" />
                          {formatRelativeTime(pin.createdAt)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}


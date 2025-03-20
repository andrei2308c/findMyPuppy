"use client"

import { useState } from "react"
import { useTranslation } from "@/lib/i18n/client"
import type { PinData } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { PawPrintIcon, MapPin, Clock, X, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface LostPetsListProps {
  pins: PinData[]
  userLocation: [number, number] | null
  onClose: () => void
}

export default function LostPetsList({ pins, userLocation, onClose }: LostPetsListProps) {
  const { t } = useTranslation()
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterGender, setFilterGender] = useState<string | null>(null)
  const [filterSize, setFilterSize] = useState<string | null>(null)

  // Calculate distance between user and pin
  const calculateDistance = (pin: PinData) => {
    if (!userLocation) return null

    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(pin.latitude - userLocation[1])
    const dLon = deg2rad(pin.longitude - userLocation[0])
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(userLocation[1])) * Math.cos(deg2rad(pin.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km

    if (d < 1) {
      return `${Math.round(d * 1000)}m`
    }
    return `${d.toFixed(1)}km`
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  // Format date to relative time
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

  // Helper function to get raw distance in kilometers
  const getDistanceInKm = (pin: PinData): number => {
    if (!userLocation) return Number.POSITIVE_INFINITY

    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(pin.latitude - userLocation[1])
    const dLon = deg2rad(pin.longitude - userLocation[0])
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(userLocation[1])) * Math.cos(deg2rad(pin.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  // Filter and sort pins
  const getFilteredAndSortedPins = () => {
    if (!pins.length) return []

    let filteredPins = [...pins]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredPins = filteredPins.filter(
        (pin) =>
          pin.dogName.toLowerCase().includes(query) ||
          pin.description.toLowerCase().includes(query) ||
          pin.color.toLowerCase().includes(query),
      )
    }

    // Apply gender filter
    if (filterGender) {
      filteredPins = filteredPins.filter((pin) => pin.gender === filterGender)
    }

    // Apply size filter
    if (filterSize) {
      filteredPins = filteredPins.filter((pin) => pin.size === filterSize)
    }

    // Sort by distance if user location available
    if (userLocation) {
      return filteredPins.sort((a, b) => {
        // Get the raw distance in kilometers
        const distA = getDistanceInKm(a)
        const distB = getDistanceInKm(b)

        // Compare directly using the numeric values
        return distA - distB
      })
    }

    // If no user location, sort by most recent
    return filteredPins.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Handle pin click
  const handlePinClick = (pin: PinData) => {
    // Call the global flyToPin function
    if (typeof window !== "undefined" && (window as any).flyToPin) {
      ;(window as any).flyToPin(pin.id)
    }

    // Show detailed view
    setSelectedPin(pin)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setFilterGender(null)
    setFilterSize(null)
  }

  const filteredPins = getFilteredAndSortedPins()
  const hasActiveFilters = searchQuery || filterGender || filterSize

  return (
    <>
      <div className="w-full h-full bg-white overflow-hidden flex flex-col">
        {/* Header with gradient */}
        <div className="p-3 border-b bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <PawPrintIcon className="h-5 w-5" />
            <h2 className="font-bold">{t("lostPetsList.title")}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white hover:bg-white/10">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-2 border-b bg-gray-50 sticky top-[57px] z-[5]">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("lostPetsList.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm border-gray-200 focus:border-violet-500 focus:ring-violet-500"
              />
              {searchQuery && (
                <button
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 border-gray-200">
                  <Filter className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="p-2 text-xs font-medium text-gray-500">{t("lostPetsList.filterBy")}</div>

                <div className="px-2 py-1.5 border-t">
                  <div className="text-xs font-medium mb-1.5">{t("addPin.gender")}</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant={filterGender === "Male" ? "default" : "outline"}
                      className={`text-[10px] cursor-pointer ${filterGender === "Male" ? "bg-blue-500" : "hover:bg-blue-100"}`}
                      onClick={() => setFilterGender(filterGender === "Male" ? null : "Male")}
                    >
                      {t("addPin.male")}
                    </Badge>
                    <Badge
                      variant={filterGender === "Female" ? "default" : "outline"}
                      className={`text-[10px] cursor-pointer ${filterGender === "Female" ? "bg-pink-500" : "hover:bg-pink-100"}`}
                      onClick={() => setFilterGender(filterGender === "Female" ? null : "Female")}
                    >
                      {t("addPin.female")}
                    </Badge>
                    <Badge
                      variant={filterGender === "Unknown" ? "default" : "outline"}
                      className={`text-[10px] cursor-pointer ${filterGender === "Unknown" ? "bg-gray-500" : "hover:bg-gray-100"}`}
                      onClick={() => setFilterGender(filterGender === "Unknown" ? null : "Unknown")}
                    >
                      {t("addPin.unknown")}
                    </Badge>
                  </div>
                </div>

                <div className="px-2 py-1.5 border-t">
                  <div className="text-xs font-medium mb-1.5">{t("addPin.size")}</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant={filterSize === "Small" ? "default" : "outline"}
                      className={`text-[10px] cursor-pointer ${filterSize === "Small" ? "bg-emerald-500" : "hover:bg-emerald-100"}`}
                      onClick={() => setFilterSize(filterSize === "Small" ? null : "Small")}
                    >
                      {t("addPin.small")}
                    </Badge>
                    <Badge
                      variant={filterSize === "Medium" ? "default" : "outline"}
                      className={`text-[10px] cursor-pointer ${filterSize === "Medium" ? "bg-amber-500" : "hover:bg-amber-100"}`}
                      onClick={() => setFilterSize(filterSize === "Medium" ? null : "Medium")}
                    >
                      {t("addPin.medium")}
                    </Badge>
                    <Badge
                      variant={filterSize === "Large" ? "default" : "outline"}
                      className={`text-[10px] cursor-pointer ${filterSize === "Large" ? "bg-orange-500" : "hover:bg-orange-100"}`}
                      onClick={() => setFilterSize(filterSize === "Large" ? null : "Large")}
                    >
                      {t("addPin.large")}
                    </Badge>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="p-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs h-7 text-gray-500 hover:text-gray-700"
                      onClick={clearFilters}
                    >
                      {t("lostPetsList.clearFilters")}
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {filterGender && (
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-gray-100 hover:bg-gray-200 gap-1 pl-2 pr-1 py-0"
                  onClick={() => setFilterGender(null)}
                >
                  {filterGender === "Male"
                    ? t("addPin.male")
                    : filterGender === "Female"
                      ? t("addPin.female")
                      : t("addPin.unknown")}
                  <X className="h-3 w-3" />
                </Badge>
              )}

              {filterSize && (
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-gray-100 hover:bg-gray-200 gap-1 pl-2 pr-1 py-0"
                  onClick={() => setFilterSize(null)}
                >
                  {filterSize === "Small"
                    ? t("addPin.small")
                    : filterSize === "Medium"
                      ? t("addPin.medium")
                      : t("addPin.large")}
                  <X className="h-3 w-3" />
                </Badge>
              )}

              {(filterGender || filterSize) && (
                <button className="text-[10px] text-violet-600 hover:text-violet-800 ml-1" onClick={clearFilters}>
                  {t("lostPetsList.clearAll")}
                </button>
              )}
            </div>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredPins.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-3">
                  <PawPrintIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium">{t("lostPetsList.noPets")}</p>
                {hasActiveFilters && (
                  <Button variant="link" size="sm" className="mt-2 text-violet-600" onClick={clearFilters}>
                    {t("lostPetsList.clearFilters")}
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPins.map((pin) => (
                  <div
                    key={pin.id}
                    className="p-3 bg-white hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-100 shadow-sm"
                    onClick={() => handlePinClick(pin)}
                  >
                    <div className="flex flex-col">
                      {/* Distance indicator at the top if available */}
                      {userLocation && (
                        <div className="mb-2">
                          <Badge className="bg-violet-100 text-violet-700 border-0 flex items-center gap-1 px-2 py-1">
                            <MapPin className="h-3 w-3" />
                            <span className="font-medium">{calculateDistance(pin)}</span>
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
                            <div className="w-full h-full flex items-center justify-center bg-violet-100">
                              <PawPrintIcon className="h-8 w-8 text-violet-400" />
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
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1 py-0 h-4 text-emerald-600 border-emerald-200 bg-emerald-50"
                            >
                              {pin.color}
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
            )}
          </div>
        </ScrollArea>

        {/* Results count */}
        {filteredPins.length > 0 && (
          <div className="p-2 border-t bg-gray-50 text-xs text-gray-500 text-center">
            {filteredPins.length} {filteredPins.length === 1 ? t("lostPetsList.pet") : t("lostPetsList.pets")}
          </div>
        )}
      </div>

      {/* Detailed Pet View Dialog */}
      {selectedPin && (
        <Dialog open={!!selectedPin} onOpenChange={() => setSelectedPin(null)}>
          <DialogContent
            className="sm:max-w-md p-0 overflow-hidden rounded-xl"
            aria-describedby="pet-details-description"
          >
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 text-white">
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <PawPrintIcon className="h-5 w-5" />
                {selectedPin.dogName}
              </DialogTitle>
            </div>

            {/* Photo Carousel */}
            {selectedPin.photos && selectedPin.photos.length > 0 && (
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {selectedPin.photos.map((photo, index) => (
                      <CarouselItem key={index}>
                        <div className="h-48 sm:h-64 w-full">
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`${selectedPin.dogName} photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>

                {/* Carousel indicators */}
                {selectedPin.photos.length > 1 && (
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {selectedPin.photos.map((_, index) => (
                      <div key={index} className="h-1.5 w-1.5 rounded-full bg-white/70" />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="p-4 space-y-3">
              {/* Pet Details */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  className={`${
                    selectedPin.gender === "Male"
                      ? "bg-blue-100 text-blue-700"
                      : selectedPin.gender === "Female"
                        ? "bg-pink-100 text-pink-700"
                        : "bg-gray-100 text-gray-700"
                  } border-0`}
                >
                  {selectedPin.gender}
                </Badge>
                <Badge className="bg-amber-100 text-amber-700 border-0">{selectedPin.size}</Badge>
                <Badge className="bg-emerald-100 text-emerald-700 border-0">{selectedPin.color}</Badge>
                {userLocation && (
                  <Badge className="bg-violet-100 text-violet-700 border-0">
                    <MapPin className="h-3 w-3 mr-1" />
                    {calculateDistance(selectedPin)}
                  </Badge>
                )}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{selectedPin.description}</p>
              </div>

              {/* Reporter Info */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                <h4 className="text-sm font-medium text-gray-700">{t("lostPetsList.contactInfo")}</h4>
                <p className="text-sm">
                  <span className="text-gray-500">{t("lostPetsList.reportedBy")}:</span> {selectedPin.reporterName}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">{t("lostPetsList.phone")}:</span> {selectedPin.reporterPhone}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t("lostPetsList.reportedTime")}: {formatRelativeTime(selectedPin.createdAt)}
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                onClick={() => {
                  if (typeof window !== "undefined" && (window as any).flyToPin) {
                    ;(window as any).flyToPin(selectedPin.id)
                    setSelectedPin(null)
                  }
                }}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {t("lostPetsList.viewOnMap")}
              </Button>
            </div>
            {/* Add a visually hidden description for screen readers */}
            <div id="pet-details-description" className="sr-only">
              Detailed information about the selected pet including photos, description, and contact information.
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}


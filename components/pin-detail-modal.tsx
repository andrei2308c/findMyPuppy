"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, User, Phone, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "@/lib/i18n/client"
import { useMapContext } from "@/lib/contexts/MapContext"
import { motion, AnimatePresence } from "framer-motion"

interface PinDetailModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PinDetailModal({ isOpen, onClose }: PinDetailModalProps) {
  const { t } = useTranslation()
  const { selectedPin, mapMode, userLocation } = useMapContext()
  const [mounted, setMounted] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const calculateDistance = () => {
    if (!userLocation || !selectedPin) return null

    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(selectedPin.latitude - userLocation[1])
    const dLon = deg2rad(selectedPin.longitude - userLocation[0])
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(userLocation[1])) *
        Math.cos(deg2rad(selectedPin.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
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

  const handleViewOnMap = () => {
    if (selectedPin && typeof window !== "undefined" && (window as any).flyToPin) {
      console.log("View on map clicked for pin:", selectedPin.id)
      ;(window as any).flyToPin(selectedPin.id)
      onClose()
    }
  }

  if (!mounted || !selectedPin) return null

  // Get gender icon
  const getGenderIcon = () => {
    if (selectedPin.gender === "Male") return "♂"
    if (selectedPin.gender === "Female") return "♀"
    return "?"
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1], // Custom ease curve for a nice accordion effect
            }}
            className="relative bg-white rounded-xl overflow-hidden w-full max-w-md mx-4 shadow-2xl max-h-[90dvh] flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Pet image */}
            <div className="relative w-full h-72 group overflow-hidden touch-pan-y flex-shrink-0">
              {selectedPin.photos && selectedPin.photos.length > 0 ? (
                <>
                  <motion.div
                    className="w-full h-full flex"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    style={{ x: -currentImageIndex * 100 + "%" }}
                    animate={{ x: -currentImageIndex * 100 + "%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = offset.x

                      if (swipe < -70 && currentImageIndex < (selectedPin.photos?.length || 1) - 1) {
                        setCurrentImageIndex(currentImageIndex + 1)
                      } else if (swipe > 70 && currentImageIndex > 0) {
                        setCurrentImageIndex(currentImageIndex - 1)
                      }
                    }}
                  >
                    {selectedPin.photos.map((photo, index) => (
                      <div key={index} className="w-full h-full flex-shrink-0">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`${selectedPin.dogName} photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          draggable="false"
                        />
                      </div>
                    ))}
                  </motion.div>

                  {/* Left arrow */}
                  {selectedPin.photos.length > 1 && currentImageIndex > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex(currentImageIndex - 1)
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  )}

                  {/* Right arrow */}
                  {selectedPin.photos.length > 1 && currentImageIndex < selectedPin.photos.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex(currentImageIndex + 1)
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No image available</span>
                </div>
              )}

              {/* Pet name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h2 className="text-4xl font-bold text-white">{selectedPin.dogName}</h2>

                {/* Image indicators */}
                {selectedPin.photos && selectedPin.photos.length > 1 && (
                  <div className="flex gap-1.5 mt-2">
                    {selectedPin.photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentImageIndex ? "w-8 bg-white" : "w-1.5 bg-white/50"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto flex-1">
              {/* Characteristics */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="rounded-full py-1.5 px-4 bg-blue-50 text-blue-600 border-0 font-medium">
                  {getGenderIcon()} {selectedPin.gender}
                </Badge>
                <Badge className="rounded-full py-1.5 px-4 bg-amber-50 text-amber-600 border-0 font-medium">
                  <span className="mr-1">📏</span> {selectedPin.size}
                </Badge>
                <Badge className="rounded-full py-1.5 px-4 bg-green-50 text-green-600 border-0 font-medium">
                  <span className="mr-1">🎨</span> {selectedPin.color}
                </Badge>
              </div>

              {/* Reported time */}
              <div className="flex items-center text-gray-500 mb-4">
                <Clock className="h-4 w-4 mr-1.5" />
                <span>
                  {t("lostPetsList.reportedTime")}: {formatRelativeTime(selectedPin.createdAt)}
                </span>
              </div>

              {/* Description */}
              <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100 mb-4">
                <p className="text-gray-700">{selectedPin.description}</p>
              </div>

              {/* Contact info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                <h3 className="text-orange-500 font-medium mb-3 flex items-center">
                  <Phone className="h-4 w-4 mr-1.5" />
                  {t("lostPetsList.contactInfo")}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 flex-shrink-0 text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">{t("lostPetsList.reportedBy")}</div>
                      <div className="font-medium">{selectedPin.reporterName}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 flex-shrink-0 text-gray-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">{t("lostPetsList.phone")}</div>
                      <div className="font-medium">{selectedPin.reporterPhone}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* View on map button */}
              <Button
                onClick={handleViewOnMap}
                className="w-full py-6 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-medium"
              >
                <MapPin className="h-5 w-5 mr-2" />
                {t("lostPetsList.viewOnMap")}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}


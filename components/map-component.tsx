"use client"

import { useEffect, useRef, useState, useCallback, memo } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useTranslation } from "@/lib/i18n/client"
import { Button } from "@/components/ui/button"
import { Search, HelpCircle, Plus, Minus } from "lucide-react"
import PinDetailModal from "./pin-detail-modal"
import { useMapContext } from "@/lib/contexts/MapContext"
import type { PinData } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { useLocation } from "@/hooks/use-location"

// Set mapbox token
mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
  "pk.eyJ1Ijoic3RhbmVzY3UxODkyIiwiYSI6ImNtN3h4eTBncDAyd2YybHNqeGl6Z2RzZHgifQ.mAVU2SZq18pbUpslpmGcog"

// Define default center and zoom
const defaultCenter: [number, number] = [26.1025, 44.4268] // Bucharest coordinates
const defaultZoom: number = 10

// Create marker elements outside component to prevent recreation
const createMarkerElement = (mode: "lost" | "found", isDraggable = false) => {
  const el = document.createElement("div")
  el.className = mode === "lost" ? "lost-dog-marker" : "found-dog-marker"
  if (isDraggable) {
    el.style.cursor = "move"
  }

  el.innerHTML = `
    <div class="pin-wrapper">
      <img 
        src="${mode === "lost" ? "/orange-pin.png" : "/pink-pin.png"}" 
        alt="${mode === "lost" ? "Lost pet marker" : "Found pet marker"}"
        class="h-8 w-8 transition-transform duration-200 ${isDraggable ? "animate-pulse" : "hover:scale-110"}"
      />
    </div>
  `
  return el
}

function MapComponentBase() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { locationGranted, requestLocation } = useLocation()
  const {
    pins,
    foundPins,
    mapMode,
    setMapMode,
    userLocation,
    selectedPin,
    setSelectedPin,
    refreshPins,
    isPinPlacementMode,
    setIsPinPlacementMode,
    draftPin,
    setDraftPin,
    updateUserLocation,
  } = useMapContext()

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const userMarker = useRef<mapboxgl.Marker | null>(null)
  const markersRef = useRef<{ [id: string]: mapboxgl.Marker }>({})
  const draftMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [mapInitialized, setMapInitialized] = useState(false)
  const mapInitializationAttempts = useRef(0)
  const MAX_INITIALIZATION_ATTEMPTS = 3
  const initialLocationSet = useRef(false)
  const [showLocationButton, setShowLocationButton] = useState(false)
  const previousMapModeRef = useRef<"lost" | "found">(mapMode)
  const userMarkerPositionRef = useRef<[number, number] | null>(null)

  // Get stored location
  const getStoredLocation = useCallback((): [number, number] | null => {
    if (typeof window === "undefined") return null

    const storedLocation = localStorage.getItem("lastKnownLocation")
    if (storedLocation) {
      try {
        return JSON.parse(storedLocation)
      } catch (e) {
        console.error("Error parsing stored location:", e)
      }
    }
    return null
  }, [])

  // Initialize map with retry logic
  const initializeMap = useCallback(() => {
    if (!mapContainer.current || map.current) return

    try {
      console.log("Attempting map initialization...")

      // Check WebGL support first
      if (!mapboxgl.supported()) {
        toast({
          title: t("errors.webglNotSupported"),
          description: t("errors.webglNotSupportedDesc"),
          variant: "destructive",
        })
        return
      }

      // Try to get stored location first
      let initialCenter = defaultCenter
      // const storedLocation = getStoredLocation()
      // if (storedLocation) {
      //   initialCenter = storedLocation
      //   userMarkerPositionRef.current = storedLocation
      //   console.log("Using stored location for map center:", initialCenter)
      // } else
      if (userLocation) {
        initialCenter = userLocation
        userMarkerPositionRef.current = userLocation
      }

      // Create map instance with optimized settings
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: initialCenter,
        zoom: initialCenter !== defaultCenter ? 14 : defaultZoom,
        attributionControl: false,
        preserveDrawingBuffer: true,
        antialias: true,
        trackResize: false, // Disable automatic resize handling
        refreshExpiredTiles: false, // Prevent automatic tile refresh
      })

      // Add attribution control
      map.current.addControl(
        new mapboxgl.AttributionControl({
          compact: true,
        }),
      )

      // Set up event listeners
      map.current.on("load", () => {
        console.log("Map loaded successfully")
        setMapInitialized(true)
        updateMapWithPins(mapMode === "lost" ? pins : foundPins, mapMode)

        // Add user marker if we have a location
        if (userMarkerPositionRef.current) {
          updateUserMarker(userMarkerPositionRef.current, mapMode)
          initialLocationSet.current = true
        }

        // Show location button after map is loaded
        setShowLocationButton(true)
      })

      // Handle WebGL context lost
      map.current.on("webglcontextlost", (event) => {
        // Access preventDefault through originalEvent which contains the WebGL event
        event.originalEvent?.preventDefault()
        console.log("WebGL context lost, attempting to restore...")

        // Clean up existing markers
        Object.values(markersRef.current).forEach((marker) => marker.remove())
        markersRef.current = {}

        if (userMarker.current) {
          userMarker.current.remove()
          userMarker.current = null
        }

        // Attempt to restore the map
        if (mapInitializationAttempts.current < MAX_INITIALIZATION_ATTEMPTS) {
          mapInitializationAttempts.current++
          setTimeout(() => {
            if (map.current) {
              map.current.remove()
              map.current = null
            }
            initializeMap()
          }, 1000)
        } else {
          toast({
            title: t("errors.mapError"),
            description: t("errors.mapErrorDesc"),
            variant: "destructive",
          })
        }
      })

      // Handle WebGL context restored
      map.current.on("webglcontextrestored", () => {
        console.log("WebGL context restored")
        updateMapWithPins(mapMode === "lost" ? pins : foundPins, mapMode)
        if (userMarkerPositionRef.current) {
          updateUserMarker(userMarkerPositionRef.current, mapMode)
        }
      })

      // Handle errors
      map.current.on("error", (e) => {
        console.error("Map error:", e)
        toast({
          title: t("errors.mapError"),
          description: e.error?.message || t("errors.genericError"),
          variant: "destructive",
        })
      })
    } catch (error) {
      console.error("Error initializing map:", error)
      toast({
        title: t("errors.mapInitError"),
        description: t("errors.mapInitErrorDesc"),
        variant: "destructive",
      })
    }
  }, [userLocation, mapMode, pins, foundPins, t, toast, getStoredLocation])

  // Initialize map once
  useEffect(() => {
    initializeMap()

    // Cleanup function
    return () => {
      if (map.current) {
        Object.values(markersRef.current).forEach((marker) => marker.remove())
        markersRef.current = {}

        if (userMarker.current) {
          userMarker.current.remove()
          userMarker.current = null
        }

        map.current.remove()
        map.current = null
      }
    }
  }, [initializeMap])

  // Update user location marker when location changes - but ONLY on initial load
  useEffect(() => {
    if (!map.current || !userLocation || initialLocationSet.current) return

    console.log("Setting initial user location marker:", userLocation)

    // Store the user location for future reference
    userMarkerPositionRef.current = userLocation

    // Center map on user location ONLY if it's the first time getting location
    map.current.flyTo({
      center: userLocation,
      zoom: 14,
    })
    initialLocationSet.current = true

    // Create or update user marker with the appropriate color based on map mode
    updateUserMarker(userLocation, mapMode)
  }, [userLocation, mapMode])

  // Update map pins when pins or map mode changes
  useEffect(() => {
    if (!map.current || !mapInitialized) return

    console.log("Updating map pins for mode:", mapMode)

    if (mapMode === "lost") {
      updateMapWithPins(pins, "lost")
    } else {
      updateMapWithPins(foundPins, "found")
    }

    // Track mode change
    const modeChanged = previousMapModeRef.current !== mapMode
    previousMapModeRef.current = mapMode

    // Update user marker color when map mode changes
    // But don't recenter the map when switching modes
    if (userMarkerPositionRef.current) {
      updateUserMarker(userMarkerPositionRef.current, mapMode)
    }
  }, [mapMode, pins, foundPins, mapInitialized])

  // Function to update user marker with the appropriate color
  const updateUserMarker = useCallback((location: [number, number], mode: "lost" | "found") => {
    if (!map.current) return

    // Store the position for future reference
    userMarkerPositionRef.current = location

    // Remove existing marker if it exists
    if (userMarker.current) {
      userMarker.current.remove()
      userMarker.current = null
    }

    // Create a DOM element for the custom marker
    const el = document.createElement("div")
    el.className = "user-marker"

    // Set the color based on the map mode (reverse of the theme color)
    const markerColor = mode === "lost" ? "#f472b6" : "#ff9700" // Pink for lost mode, Orange for found mode

    el.innerHTML = `
      <div class="w-8 h-8 bg-[${markerColor}] border-4 border-white rounded-full flex items-center justify-center shadow-lg">
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>
    `

    // Create new marker
    userMarker.current = new mapboxgl.Marker(el).setLngLat(location).addTo(map.current)
  }, [])

  // Handle pin click to show modal
  const handlePinClick = useCallback(
    (pin: PinData) => {
      console.log("Pin clicked:", pin.id)
      setSelectedPin(pin)
      setIsPinModalOpen(true)
    },
    [setSelectedPin],
  )

  // Update map with pins based on mode - optimized to avoid unnecessary marker recreation
  const updateMapWithPins = useCallback(
    (pinsData: PinData[], mode: "lost" | "found") => {
      if (!map.current) return

      console.log(`Updating map with ${pinsData.length} ${mode} pins`)

      // Track current pins to avoid removing and recreating unchanged markers
      const currentPinIds = new Set(pinsData.map((pin) => pin.id))
      const markersToRemove = Object.keys(markersRef.current).filter((id) => !currentPinIds.has(id))

      // Remove markers that are no longer needed
      markersToRemove.forEach((id) => {
        if (markersRef.current[id]) {
          markersRef.current[id].remove()
          delete markersRef.current[id]
        }
      })

      // Add new markers for pins that don't have markers yet
      pinsData.forEach((pin) => {
        // Skip if marker already exists
        if (markersRef.current[pin.id]) return

        // Create a DOM element for the custom marker
        const el = createMarkerElement(mode)

        // Add click event to the marker element
        el.addEventListener("click", () => {
          handlePinClick(pin)
        })

        try {
          // Create marker without popup
          const marker = new mapboxgl.Marker(el).setLngLat([pin.longitude, pin.latitude]).addTo(map.current!)
          markersRef.current[pin.id] = marker
        } catch (error) {
          console.error("Error adding marker:", error)
        }
      })
    },
    [handlePinClick],
  )

  // Handle draft pin for placement mode
  useEffect(() => {
    if (!map.current || !isPinPlacementMode) return

    // Remove existing draft marker if it exists
    if (draftMarkerRef.current) {
      draftMarkerRef.current.remove()
      draftMarkerRef.current = null
    }

    // Create a DOM element for the draggable marker
    const el = createMarkerElement(mapMode, true)

    // Create initial position - either use the draft pin location or center of the map
    const initialPosition = draftPin
      ? [draftPin.longitude, draftPin.latitude]
      : (map.current.getCenter().toArray() as [number, number])

    // Create a draggable marker
    draftMarkerRef.current = new mapboxgl.Marker({
      element: el,
      draggable: true,
    })
      .setLngLat([initialPosition[0], initialPosition[1]])
      .addTo(map.current)

    // Add a tooltip to the marker
    const tooltip = new mapboxgl.Popup({
      closeButton: false,
      className: "custom-popup",
      offset: 25,
    }).setHTML(`<div class="p-2 text-sm font-medium">${t("addPin.dragToPosition")}</div>`)

    draftMarkerRef.current.setPopup(tooltip)
    tooltip.addTo(map.current)

    // Add drag end event listener
    draftMarkerRef.current.on("dragend", () => {
      if (!draftMarkerRef.current) return

      const lngLat = draftMarkerRef.current.getLngLat()

      // Update the draft pin with the new coordinates
      setDraftPin((prev) => {
        if (!prev) {
          // Create a new draft pin if it doesn't exist
          return {
            id: `draft-${Date.now()}`,
            dogName: "",
            description: "",
            longitude: lngLat.lng,
            latitude: lngLat.lat,
            gender: "Unknown",
            size: "Medium",
            color: "",
            reporterName: "",
            reporterPhone: "",
            createdAt: new Date().toISOString(),
          }
        }

        // Update existing draft pin
        return {
          ...prev,
          longitude: lngLat.lng,
          latitude: lngLat.lat,
        }
      })
    })

    // Center the map on the marker
    map.current.flyTo({
      center: [initialPosition[0], initialPosition[1]],
      zoom: 15,
      essential: true,
    })

    // Add a "Done" button to the map
    const doneButtonContainer = document.createElement("div")
    doneButtonContainer.className = "absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10"
    doneButtonContainer.innerHTML = `
      <button id="done-placing-pin" class="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium rounded-full shadow-lg">
        ${t("addPin.confirmLocation")}
      </button>
    `

    map.current.getContainer().appendChild(doneButtonContainer)

    // Add event listener to the done button
    document.getElementById("done-placing-pin")?.addEventListener("click", () => {
      if (draftMarkerRef.current) {
        const lngLat = draftMarkerRef.current.getLngLat()

        // Update the draft pin with the final coordinates
        setDraftPin((prev) => {
          if (!prev) return null
          return {
            ...prev,
            longitude: lngLat.lng,
            latitude: lngLat.lat,
          }
        })

        // Exit pin placement mode
        setIsPinPlacementMode(false)
      }
    })

    return () => {
      // Clean up
      if (draftMarkerRef.current) {
        draftMarkerRef.current.remove()
        draftMarkerRef.current = null
      }

      // Remove the done button
      const doneButton = document.getElementById("done-placing-pin")?.parentElement
      if (doneButton) {
        doneButton.remove()
      }
    }
  }, [isPinPlacementMode, mapMode, draftPin, t, setDraftPin, setIsPinPlacementMode])

  // Update the toggle function to notify parent component
  const toggleMapMode = useCallback(() => {
    const newMode = mapMode === "lost" ? "found" : "lost"
    setMapMode(newMode)
  }, [mapMode, setMapMode])

  // Fly to pin location on map
  const flyToPin = useCallback(
    (pinId: string) => {
      if (!map.current) return

      console.log("Flying to pin:", pinId)

      // Handle prefixed IDs by removing the prefix
      const normalizedPinId = typeof pinId === "string" ? pinId.replace(/^(lost-|found-)/, "") : pinId
      console.log("Normalized pin ID:", normalizedPinId)

      // First check if the pin exists in the current mode's pins
      const currentPins = mapMode === "lost" ? pins : foundPins
      let pin = currentPins.find((p) => p.id === normalizedPinId || p.id === pinId)
      console.log("Found pin in current mode:", pin)

      // If pin not found, it might be in the other mode's pins
      if (!pin) {
        console.log("Pin not found in current mode, checking other mode")
        const otherModePins = mapMode === "lost" ? foundPins : pins
        pin = otherModePins.find((p) => p.id === normalizedPinId || p.id === pinId)
        console.log("Found pin in other mode:", pin)
      }

      if (!pin) {
        console.warn("Pin not found:", pinId)
        return
      }

      // Fly to the pin location with animation
      map.current.flyTo({
        center: [pin.longitude, pin.latitude],
        zoom: 15,
        essential: true,
        duration: 1000, // Animation duration in milliseconds
      })
    },
    [mapMode, pins, foundPins],
  )

  // Method to open the pin detail modal
  const openPinDetailModal = useCallback(() => {
    console.log("Opening pin detail modal for:", selectedPin?.id)
    setIsPinModalOpen(true)
  }, [selectedPin])

  // Expose methods to parent components
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).flyToPin = flyToPin
      ;(window as any).openPinDetailModal = openPinDetailModal
    }

    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).flyToPin
        delete (window as any).openPinDetailModal
      }
    }
  }, [flyToPin, openPinDetailModal])

  // Watch for selectedPin changes to open the modal
  useEffect(() => {
    if (selectedPin) {
      console.log("selectedPin changed, opening modal:", selectedPin.id)
      setIsPinModalOpen(true)
    }
  }, [selectedPin])

  // Explicitly recenter map on user location ONLY when button is clicked
  const handleRelocateMe = useCallback(() => {
    if (!map.current) return

    // First try to use the stored location reference
    if (userMarkerPositionRef.current) {
      map.current.flyTo({
        center: userMarkerPositionRef.current,
        zoom: 15,
        essential: true,
      })
      return
    }

    // Then try to use the context location
    if (userLocation) {
      // Update the stored reference
      userMarkerPositionRef.current = userLocation

      map.current.flyTo({
        center: userLocation,
        zoom: 15,
        essential: true,
      })
      return
    }

    // Finally try to get from localStorage
    const storedLocation = getStoredLocation()
    if (storedLocation) {
      try {
        // Update the stored reference
        userMarkerPositionRef.current = storedLocation

        map.current.flyTo({
          center: storedLocation,
          zoom: 15,
          essential: true,
        })

        // Also update the user marker
        updateUserMarker(storedLocation, mapMode)
      } catch (e) {
        console.error("Error parsing stored location:", e)
        // Only request a new location if all else fails
        updateUserLocation()
      }
    } else {
      // Only request a new location if all else fails
      updateUserLocation()
    }
  }, [userLocation, updateUserLocation, getStoredLocation, mapMode, updateUserMarker])

  const handleZoomIn = useCallback(() => {
    if (!map.current) return
    map.current.zoomIn()
  }, [])

  const handleZoomOut = useCallback(() => {
    if (!map.current) return
    map.current.zoomOut()
  }, [])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {/* Map Mode Toggle Button - Only visible on desktop */}
      <div className="absolute top-4 right-4 z-10 hidden md:block">
        <Button
          onClick={toggleMapMode}
          className={`px-4 py-2 rounded-full shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white/90 ${
            mapMode === "lost" ? "text-orange-500 border border-orange-200" : "text-pink-400 border border-pink-200"
          }`}
        >
          {mapMode === "lost" ? (
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>{t("mapMode.lost")}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>{t("mapMode.found")}</span>
            </div>
          )}
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-28 right-2 z-10 flex flex-col gap-2">
        <Button
          onClick={handleZoomIn}
          className={`h-12 w-12 rounded-full shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 ${
            mapMode === "lost" ? "text-orange-500 border border-orange-200" : "text-pink-400 border border-pink-200"
          }`}
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          onClick={handleZoomOut}
          className={`h-12 w-12 rounded-full shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 ${
            mapMode === "lost" ? "text-orange-500 border border-orange-200" : "text-pink-400 border border-pink-200"
          }`}
        >
          <Minus className="h-5 w-5" />
        </Button>
      </div>

      {/* Relocate Me Button */}
      {showLocationButton && (
        <div className="absolute bottom-6 right-2 z-10">
          <Button
            onClick={handleRelocateMe}
            className={`h-12 w-12 rounded-full shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 ${
              mapMode === "lost" ? "text-orange-500 border border-orange-200" : "text-pink-400 border border-pink-200"
            }`}
            title={t("relocateMe")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22" />
              <line x1="22" y1="12" x2="20" y2="12" />
              <line x1="4" y1="12" x2="2" y2="12" />
            </svg>
          </Button>
        </div>
      )}

      {/* Pin Detail Modal */}
      <PinDetailModal isOpen={isPinModalOpen} onClose={() => setIsPinModalOpen(false)} />
    </div>
  )
}

// Wrap with memo to prevent unnecessary re-renders
const MapComponent = memo(MapComponentBase)
export default MapComponent


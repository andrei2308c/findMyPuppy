"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode, useRef } from "react"
import type { PinData } from "@/lib/types"
import { fetchPins, addPin as addPinToDb } from "@/lib/pinUtils"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabaseClient"

interface MapContextType {
  pins: PinData[]
  setPins: React.Dispatch<React.SetStateAction<PinData[]>>
  foundPins: PinData[]
  setFoundPins: React.Dispatch<React.SetStateAction<PinData[]>>
  mapMode: "lost" | "found"
  setMapMode: (mode: "lost" | "found") => void
  userLocation: [number, number] | null
  setUserLocation: (location: [number, number] | null) => void
  selectedPin: PinData | null
  setSelectedPin: (pin: PinData | null) => void
  isLoading: boolean
  refreshPins: () => Promise<void>
  nearbyPins: PinData[]
  addPin: (pin: PinData, mode: "lost" | "found") => Promise<PinData[] | null>
  newPin: PinData | null
  showNewPinNotification: boolean
  dismissNewPinNotification: () => void
  viewNewPin: () => void
  openPinDetailModal: (pin: PinData, forceCurrentMode?: boolean) => void
  isPinPlacementMode: boolean
  setIsPinPlacementMode: (mode: boolean) => void
  draftPin: PinData | null
  setDraftPin: (pin: PinData | null) => void
  updateUserLocation: () => void
}

const MapContext = createContext<MapContextType | undefined>(undefined)

export function MapProvider({ children }: { children: ReactNode }) {
  const [pins, setPins] = useState<PinData[]>([])
  const [foundPins, setFoundPins] = useState<PinData[]>([])
  const [mapMode, setMapMode] = useState<"lost" | "found">("lost")
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [nearbyPins, setNearbyPins] = useState<PinData[]>([])
  const [newPin, setNewPin] = useState<PinData | null>(null)
  const [showNewPinNotification, setShowNewPinNotification] = useState(false)
  const { toast } = useToast()
  const supabaseSubscription = useRef<any>(null)
  const shouldOpenModalRef = useRef<boolean>(false)
  const pendingPinRef = useRef<PinData | null>(null)
  const [isPinPlacementMode, setIsPinPlacementMode] = useState(false)
  const [draftPin, setDraftPin] = useState<PinData | null>(null)
  const modeChangeInProgressRef = useRef(false)
  const [locationRequested, setLocationRequested] = useState(false)
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null)

  // Function to get stored location
  const getStoredLocation = useCallback((): [number, number] | null => {
    if (typeof window === "undefined") return null

    // We'll no longer use the stored location
    // const storedLocation = localStorage.getItem("lastKnownLocation")
    // if (storedLocation) {
    //   try {
    //     return JSON.parse(storedLocation)
    //   } catch (e) {
    //     console.error("Error parsing stored location:", e)
    //   }
    // }
    return null
  }, [])

  // Function to set and store location
  const setAndStoreLocation = useCallback((location: [number, number]) => {
    setUserLocation(location)
    if (typeof window !== "undefined") {
      localStorage.setItem("lastKnownLocation", JSON.stringify(location))
    }
    console.log("Location stored:", location)
  }, [])

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationGranted(false)
      return
    }

    setLocationRequested(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords
        console.log("New location acquired:", longitude, latitude)
        setAndStoreLocation([longitude, latitude])
        setLocationGranted(true)
        localStorage.setItem("locationPermission", "granted")
      },
      (error) => {
        console.error("Error getting location:", error.code, error.message)
        setLocationGranted(false)
        localStorage.setItem("locationPermission", "denied")
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }, [setAndStoreLocation])

  // Function to manually update user location
  const updateUserLocation = useCallback(() => {
    requestLocation()
  }, [requestLocation])

  // Define helper functions first to avoid "used before initialization" errors
  const deg2rad = useCallback((deg: number) => {
    return deg * (Math.PI / 180)
  }, [])

  // Calculate distance between two points
  const calculateDistance = useCallback(
    (pin: PinData, loc: [number, number]): number => {
      const R = 6371 // Radius of the earth in km
      const dLat = deg2rad(pin.latitude - loc[1])
      const dLon = deg2rad(pin.longitude - loc[0])
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(loc[1])) * Math.cos(deg2rad(pin.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c // Distance in km
    },
    [deg2rad],
  )

  // Sort pins by distance to user
  const sortPinsByDistance = useCallback(
    (pinsToSort: PinData[], location: [number, number]): PinData[] => {
      return [...pinsToSort].sort((a, b) => {
        const distA = calculateDistance(a, location)
        const distB = calculateDistance(b, location)
        return distA - distB
      })
    },
    [calculateDistance],
  )

  // Fetch pins based on map mode
  const fetchPinsData = useCallback(async (mode: "lost" | "found") => {
    setIsLoading(true)
    try {
      const data = await fetchPins(mode)
      if (mode === "lost") {
        setPins(data)
      } else {
        setFoundPins(data)
      }
      return data
    } catch (error) {
      console.error(`Error fetching ${mode} pins:`, error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Refresh pins for current mode
  const refreshPins = useCallback(async () => {
    const data = await fetchPinsData(mapMode)

    // If we have user location, filter pins within 35km and sort by distance
    if (userLocation) {
      const filteredPins = data.filter((pin) => {
        const distance = calculateDistance(pin, userLocation)
        return distance <= 10 // Show all pins within 10km
      })
      const sortedPins = sortPinsByDistance(filteredPins, userLocation)
      setNearbyPins(sortedPins.slice(0, 35)) // Cap at maximum 35 pins
    }
  }, [mapMode, userLocation, fetchPinsData, calculateDistance, sortPinsByDistance])

  // Add a new pin
  const addPin = useCallback(
    async (pin: PinData, mode: "lost" | "found") => {
      try {
        const result = await addPinToDb(pin, mode)
        if (result) {
          if (mode === "lost") {
            setPins((prev) => [...prev, ...result])

            // After adding a lost pin, check if there are any nearby found pins
            if (userLocation) {
              const nearbyFoundPins = foundPins
                .filter((foundPin) => {
                  const distance = calculateDistance(foundPin, userLocation)
                  return distance <= 5 // Within 5km
                })
                .slice(0, 3) // Limit to 3 pins

              // If there are nearby found pins, show the first one as a notification
              if (nearbyFoundPins.length > 0) {
                setTimeout(() => {
                  setNewPin(nearbyFoundPins[0])
                  pendingPinRef.current = nearbyFoundPins[0]
                  setShowNewPinNotification(true)
                }, 2000) // Show after a short delay
              }
            }
          } else {
            setFoundPins((prev) => [...prev, ...result])

            // After adding a found pin, check if there are any nearby lost pins
            if (userLocation) {
              const nearbyLostPins = pins
                .filter((lostPin) => {
                  const distance = calculateDistance(lostPin, userLocation)
                  return distance <= 5 // Within 5km
                })
                .slice(0, 3) // Limit to 3 pins

              // If there are nearby lost pins, show the first one as a notification
              if (nearbyLostPins.length > 0) {
                setTimeout(() => {
                  setNewPin(nearbyLostPins[0])
                  pendingPinRef.current = nearbyLostPins[0]
                  setShowNewPinNotification(true)
                }, 2000) // Show after a short delay
              }
            }
          }
          await refreshPins()
        }
        return result
      } catch (error) {
        console.error(`Error adding ${mode} pin:`, error)
        return null
      }
    },
    [
      userLocation,
      pins,
      foundPins,
      refreshPins,
      calculateDistance,
      setNewPin,
      setShowNewPinNotification,
      setPins,
      setFoundPins,
    ],
  )

  const dismissNewPinNotification = useCallback(() => {
    setShowNewPinNotification(false)
    setNewPin(null)
    pendingPinRef.current = null
  }, [])

  // Update the viewNewPin function to work with the pin object directly
  const viewNewPin = useCallback(() => {
    if (typeof window !== "undefined" && pendingPinRef.current) {
      console.log("viewNewPin called for pin:", pendingPinRef.current)

      // Determine the target mode based on the current mode (always switch to opposite)
      const targetMode = mapMode === "lost" ? "found" : "lost"
      console.log("Switching to mode:", targetMode)

      // Set the flag to open the modal after mode change
      shouldOpenModalRef.current = true
      modeChangeInProgressRef.current = true

      // Switch modes - the useEffect will handle opening the modal
      setMapMode(targetMode)

      // Close the notification
      setShowNewPinNotification(false)
    }
  }, [mapMode, setMapMode, setShowNewPinNotification])

  // Update the openPinDetailModal function in MapContext.tsx
  const openPinDetailModal = useCallback(
    (pin: PinData, forceCurrentMode = false) => {
      console.log("openPinDetailModal called with pin:", pin, "forceCurrentMode:", forceCurrentMode)

      // Determine if this is a lost or found pin
      const pinMode = typeof pin.id === "string" && (pin.id.toLowerCase().includes("found") ? "found" : "lost")

      console.log("Pin mode:", pinMode, "Current mode:", mapMode)

      // If we're already in the correct mode or forceCurrentMode is true, just open the modal
      if (mapMode === pinMode || forceCurrentMode) {
        setSelectedPin(pin)
        if (typeof window !== "undefined") {
          // First fly to the pin
          if ((window as any).flyToPin) {
            console.log("Flying to pin:", pin.id)
            ;(window as any).flyToPin(pin.id)
          }
          // Then open the modal
          if ((window as any).openPinDetailModal) {
            console.log("Opening pin detail modal")
            ;(window as any).openPinDetailModal()
          }
        }
      } else {
        // If we need to switch modes, store the pin and set the flag
        pendingPinRef.current = pin
        shouldOpenModalRef.current = true
        modeChangeInProgressRef.current = true
        setMapMode(pinMode as "lost" | "found")
      }
    },
    [mapMode, setMapMode, setSelectedPin],
  )

  // Update the setupRealtimeSubscriptions function to handle pin IDs correctly
  const setupRealtimeSubscriptions = useCallback(() => {
    if (!supabase) return

    // Clean up any existing subscription
    if (supabaseSubscription.current) {
      supabaseSubscription.current.unsubscribe()
    }

    // Set up subscription for both tables
    supabaseSubscription.current = supabase
      .channel("public:pins-and-found")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "pins",
        },
        (payload) => {
          console.log("New lost pin added:", payload)
          const newPinData = {
            ...(payload.new as PinData),
            id: `lost-${(payload.new as PinData).id}`, // Ensure ID has prefix
          }

          // Add the new pin to the lost pins list
          setPins((prev) => [...prev, newPinData])

          // Only show notification if:
          // 1. We have user location
          // 2. We're in "found" mode (showing notifications for the opposite mode)
          // 3. The pin is within 5km
          if (userLocation) {
            const distance = calculateDistance(newPinData, userLocation)
            console.log(`New lost pin distance: ${distance}km`)

            if (distance <= 5) {
              // Only show if within 5km
              // If we're in found mode, show notification for lost pin
              if (mapMode === "found") {
                setNewPin(newPinData)
                setShowNewPinNotification(true)
                // Store the pin for when the notification is clicked
                pendingPinRef.current = newPinData
              }
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "pins-found",
        },
        (payload) => {
          console.log("New found pin added:", payload)
          const newPinData = {
            ...(payload.new as PinData),
            id: `found-${(payload.new as PinData).id}`, // Ensure ID has prefix
          }

          // Add the new pin to the found pins list
          setFoundPins((prev) => [...prev, newPinData])

          // Only show notification if:
          // 1. We have user location
          // 2. We're in "lost" mode (showing notifications for the opposite mode)
          // 3. The pin is within 5km
          if (userLocation) {
            const distance = calculateDistance(newPinData, userLocation)
            console.log(`New found pin distance: ${distance}km`)

            if (distance <= 5) {
              // Only show if within 5km
              // If we're in lost mode, show notification for found pin
              if (mapMode === "lost") {
                setNewPin(newPinData)
                setShowNewPinNotification(true)
                // Store the pin for when the notification is clicked
                pendingPinRef.current = newPinData
              }
            }
          }
        },
      )
      .subscribe()
  }, [mapMode, userLocation, calculateDistance, setPins, setFoundPins, setNewPin, setShowNewPinNotification])

  // Check for stored location on mount
  useEffect(() => {
    // Remove the code that gets stored location
    // const storedLocation = getStoredLocation()
    // if (storedLocation) {
    //   console.log("Using stored location on mount:", storedLocation)
    //   setUserLocation(storedLocation)
    // }

    // Keep the permission check but always request a new location
    const storedPermission = localStorage.getItem("locationPermission")

    if (storedPermission === "granted" && !locationRequested) {
      requestLocation()
    } else if (storedPermission === null && !locationRequested) {
      setLocationGranted(null)
    } else if (storedPermission === "denied") {
      setLocationGranted(false)
    }
  }, [requestLocation, locationRequested, setUserLocation, getStoredLocation])

  useEffect(() => {
    setupRealtimeSubscriptions()

    return () => {
      if (supabaseSubscription.current) {
        supabaseSubscription.current.unsubscribe()
      }
    }
  }, [setupRealtimeSubscriptions])

  // Effect to handle opening modals after mode changes
  useEffect(() => {
    if (shouldOpenModalRef.current && pendingPinRef.current) {
      console.log("Mode changed, should open modal now")
      shouldOpenModalRef.current = false
      modeChangeInProgressRef.current = false

      // Get the pin that was stored when the notification was shown
      const pin = pendingPinRef.current

      // Set the selected pin
      setSelectedPin(pin)

      // Force a slight delay to ensure the map has updated
      setTimeout(() => {
        if (typeof window !== "undefined") {
          // First fly to the pin
          if ((window as any).flyToPin) {
            console.log("Flying to pin after mode change:", pin.id)
            ;(window as any).flyToPin(pin.id)
          }

          // Then open the modal
          if ((window as any).openPinDetailModal) {
            console.log("Opening pin detail modal after mode change")
            ;(window as any).openPinDetailModal()
          }
        }
      }, 500)

      // Clear the pending pin
      pendingPinRef.current = null
    }
  }, [mapMode, setSelectedPin])

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchPinsData("lost")
      await fetchPinsData("found")
    }

    loadInitialData()
  }, [fetchPinsData])

  // Update nearby pins when user location or pins change
  useEffect(() => {
    if (userLocation) {
      const currentPins = mapMode === "lost" ? pins : foundPins
      const filteredPins = currentPins.filter((pin) => {
        const distance = calculateDistance(pin, userLocation)
        return distance <= 10 // Show all pins within 10km
      })
      const sorted = sortPinsByDistance(filteredPins, userLocation)
      setNearbyPins(sorted.slice(0, 35)) // Cap at maximum 35 pins
    }
  }, [userLocation, pins, foundPins, mapMode, calculateDistance, sortPinsByDistance])

  // Expose methods to window for global access
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).refreshPins = refreshPins

      // Expose flyToPin for global access
      if (!(window as any).flyToPin) {
        ;(window as any).flyToPin = (pinId: string) => {
          console.log("flyToPin called with ID:", pinId)
        }
      }
      // Expose openPinDetailModal for opening the modal from other components
      ;(window as any).openPinDetailModal = () => {
        console.log("openPinDetailModal called")
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).refreshPins
        delete (window as any).openPinDetailModal
      }
    }
  }, [refreshPins, mapMode])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      pins,
      setPins,
      foundPins,
      setFoundPins,
      mapMode,
      setMapMode,
      userLocation,
      setUserLocation,
      selectedPin,
      setSelectedPin,
      isLoading,
      refreshPins,
      nearbyPins,
      addPin,
      newPin,
      showNewPinNotification,
      dismissNewPinNotification,
      viewNewPin,
      openPinDetailModal,
      isPinPlacementMode,
      setIsPinPlacementMode,
      draftPin,
      setDraftPin,
      updateUserLocation,
    }),
    [
      pins,
      foundPins,
      mapMode,
      userLocation,
      selectedPin,
      isLoading,
      nearbyPins,
      newPin,
      showNewPinNotification,
      isPinPlacementMode,
      draftPin,
      refreshPins,
      addPin,
      dismissNewPinNotification,
      viewNewPin,
      openPinDetailModal,
      updateUserLocation,
    ],
  )

  return <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
}

export function useMapContext() {
  const context = useContext(MapContext)
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapProvider")
  }
  return context
}


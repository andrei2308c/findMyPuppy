"use client"

import { useState, useEffect, useCallback } from "react"
import { useMapContext } from "@/lib/contexts/MapContext"

export function useLocation() {
  const { setUserLocation } = useMapContext()
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null)
  const [locationRequested, setLocationRequested] = useState(false)

  // Function to get stored location
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

  // Function to set and store location
  const setAndStoreLocation = useCallback(
    (longitude: number, latitude: number) => {
      const location: [number, number] = [longitude, latitude]
      setUserLocation(location)
      if (typeof window !== "undefined") {
        localStorage.setItem("lastKnownLocation", JSON.stringify(location))
      }
      console.log("Location stored:", location)
    },
    [setUserLocation],
  )

  // Function to request location with proper error handling
  const requestLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.")
      setLocationGranted(false)
      return
    }

    setLocationRequested(true)

    // Use stored location first
    const storedLocation = getStoredLocation()
    if (storedLocation) {
      console.log("Using stored location:", storedLocation)
      setUserLocation(storedLocation)
      setLocationGranted(true)
    }

    // Request a fresh position only if we don't have a stored one
    if (!storedLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords
          console.log("New location acquired:", longitude, latitude)
          setAndStoreLocation(longitude, latitude)
          setLocationGranted(true)
          localStorage.setItem("locationPermission", "granted")
        },
        (error) => {
          console.error("Error getting location:", error.code, error.message)
          if (!storedLocation) {
            setLocationGranted(false)
          }
          if (error.code === 1) {
            // PERMISSION_DENIED
            localStorage.setItem("locationPermission", "denied")
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 300000, // Use cached position if less than 5 minutes old
          timeout: 10000, // 10 seconds timeout
        },
      )
    }
  }, [setUserLocation, getStoredLocation, setAndStoreLocation])

  // Check for stored location on mount
  useEffect(() => {
    // Remove the code that gets stored location
    // const storedLocation = getStoredLocation()
    // const storedPermission = localStorage.getItem("locationPermission")

    // if (storedLocation) {
    //   console.log("Using stored location on mount:", storedLocation)
    //   setUserLocation(storedLocation)
    // }

    // Always request a new location if permission is granted
    const storedPermission = localStorage.getItem("locationPermission")

    if (storedPermission === "granted" && !locationRequested) {
      requestLocation()
    } else if (storedPermission === null && !locationRequested) {
      setLocationGranted(null)
    } else if (storedPermission === "denied") {
      setLocationGranted(false)
    }
  }, [requestLocation, locationRequested, setUserLocation, getStoredLocation])

  return {
    locationGranted,
    requestLocation,
    setLocationGranted,
  }
}


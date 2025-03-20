"use client"

import { useState, useEffect } from "react"

export function useDesktop() {
  // Initialize with null to prevent hydration mismatch
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    // Function to check window width
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    // Initial check
    checkIsDesktop()

    // Add resize listener
    window.addEventListener("resize", checkIsDesktop)

    // Cleanup
    return () => window.removeEventListener("resize", checkIsDesktop)
  }, [])

  return isDesktop
}


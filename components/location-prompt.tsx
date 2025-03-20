"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLocation } from "@/hooks/use-location"
import { useTranslation } from "@/lib/i18n/client"
import { MapPin } from "lucide-react"

interface LocationPromptProps {
  onResponse: (granted: boolean) => void;
}

export default function LocationPrompt({ onResponse }: LocationPromptProps) {
  const { locationGranted, requestLocation } = useLocation()
  const { t } = useTranslation()
  const [showPrompt, setShowPrompt] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Show the prompt if location permission is null (not yet granted or denied)
  useEffect(() => {
    // Always show the prompt on initial load unless user has interacted with it
    if (!hasInteracted) {
      setShowPrompt(locationGranted === null)
    } else {
      // After interaction, only show based on locationGranted state
      setShowPrompt(locationGranted === null)
    }
  }, [locationGranted, hasInteracted])

  const handleAllowLocation = () => {
    setHasInteracted(true);
    requestLocation();
    setShowPrompt(false);
    onResponse(true); // Call the callback with true
  }

  const handleDenyLocation = () => {
    setHasInteracted(true);
    setShowPrompt(false);
    onResponse(false); // Call the callback with false
  }

  if (!showPrompt) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mx-auto">
          <MapPin className="h-6 w-6 text-orange-500" />
        </div>
        <h2 className="text-xl font-bold text-center">{t("locationPrompt.title")}</h2>
        <p className="text-center text-gray-600 dark:text-gray-300">{t("locationPrompt.description")}</p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button onClick={handleDenyLocation} variant="outline" className="flex-1">
            {t("locationPrompt.deny")}
          </Button>
          <Button
            onClick={handleAllowLocation}
            className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600"
          >
            {t("locationPrompt.allow")}
          </Button>
        </div>
      </div>
    </div>
  )
}


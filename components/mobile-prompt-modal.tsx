"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import SimpleQRCode from "./simple-qr-code"

interface MobilePromptModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  closeButtonText: string
}

export default function MobilePromptModal({
  isOpen,
  onClose,
  title,
  description,
  closeButtonText,
}: MobilePromptModalProps) {
  // Add state to track if QR code component is loaded
  const [QRComponent, setQRComponent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load QR code component dynamically on client side
  useEffect(() => {
    // Only import on client side
    if (typeof window !== "undefined") {
      import("qrcode.react")
        .then((module) => {
          setQRComponent(() => module.QRCodeSVG || module.default)
        })
        .catch((err) => {
          console.error("Failed to load QR code component:", err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [])

  // Get the current URL for the QR code
  const qrValue = typeof window !== "undefined" ? window.location.origin : "https://findmypuppy.com"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <p className="text-center text-gray-600 dark:text-gray-400">{description}</p>
          <div className="p-4 bg-white rounded-lg">
            {isLoading ? (
              <div className="w-[200px] h-[200px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : QRComponent ? (
              <QRComponent value={qrValue} size={200} level="H" includeMargin />
            ) : (
              <SimpleQRCode value={qrValue} />
            )}
          </div>
          <Button onClick={onClose} className="w-full">
            {closeButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface MotionModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  width?: string
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  className?: string
}

export default function MotionModal({
  isOpen,
  onClose,
  children,
  width = "max-w-md",
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = "",
}: MotionModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Lock body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isMounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeOnBackdropClick ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, rotateX: 90, scale: 0.9 }}
            animate={{
              opacity: 1,
              rotateX: 0,
              scale: 1,
              transition: {
                type: "spring",
                damping: 20,
                stiffness: 300,
              },
            }}
            exit={{
              opacity: 0,
              rotateX: -90,
              scale: 0.9,
              transition: { duration: 0.3 },
            }}
            className={`relative z-50 ${width} w-full mx-4 overflow-hidden rounded-2xl bg-white shadow-2xl perspective-1000 ${className}`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {showCloseButton && (
              <motion.button
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 hover:bg-black/10"
                onClick={onClose}
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}


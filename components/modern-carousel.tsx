"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ModernCarouselProps {
  images: string[]
  alt: string
  height?: string
  autoplay?: boolean
  autoplayInterval?: number
}

export default function ModernCarousel({
  images,
  alt,
  height = "h-48 sm:h-64",
  autoplay = true,
  autoplayInterval = 5000,
}: ModernCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }, [images.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }, [images.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Handle autoplay
  useEffect(() => {
    if (autoplay && !isHovering && images.length > 1) {
      autoplayTimerRef.current = setTimeout(nextSlide, autoplayInterval)
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current)
      }
    }
  }, [autoplay, currentIndex, isHovering, nextSlide, autoplayInterval, images.length])

  // Touch event handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }
  }

  // If there's only one image, just show it without carousel controls
  if (images.length === 0) {
    return null
  }

  if (images.length === 1) {
    return (
      <div className={`w-full ${height} relative overflow-hidden rounded-t-lg`}>
        <img src={images[0] || "/placeholder.svg"} alt={alt} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className={`w-full ${height} relative overflow-hidden group`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Images */}
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img src={image || "/placeholder.svg"} alt={`${alt} ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows - only show on hover */}
      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            prevSlide()
          }}
          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-1 backdrop-blur-sm transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            nextSlide()
          }}
          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-1 backdrop-blur-sm transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation()
              goToSlide(index)
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}


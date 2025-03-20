"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Testimonial {
  quote: string
  author: string
  location: string
  image: string
}

interface TestimonialsProps {
  content: {
    title: string
    description: string
    items: Testimonial[]
  }
}

export default function TestimonialsSection({ content }: TestimonialsProps) {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % content.items.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, content.items.length])

  const next = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev + 1) % content.items.length)
  }

  const prev = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev - 1 + content.items.length) % content.items.length)
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {content.title}
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {content.description}
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute top-10 left-0 text-9xl text-orange-200 dark:text-orange-900/30 opacity-50 pointer-events-none">
            <Quote />
          </div>

          <div className="relative backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={content.items[current].author}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 blur-lg opacity-30" />
                  <img
                    src={content.items[current].image || "/placeholder.svg"}
                    alt={content.items[current].author}
                    className="w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-800 relative z-10"
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic mb-6 relative z-10">
                    "{content.items[current].quote}"
                  </blockquote>
                  <div>
                    <p className="font-semibold text-lg text-gray-900 dark:text-white">
                      {content.items[current].author}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{content.items[current].location}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          {content.items.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setAutoplay(false)
                setCurrent(index)
              }}
              className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                index === current ? "bg-orange-500 w-6" : "bg-gray-300 dark:bg-gray-700"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}


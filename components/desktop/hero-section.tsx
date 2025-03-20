"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search, Heart } from "lucide-react"

interface HeroSectionProps {
  content: {
    title: string
    description: string
    buttons: {
      search: string
      help: string
    }
  }
}

export default function HeroSection({ content }: HeroSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={ref} className="relative h-[80vh] overflow-hidden">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop)",
          y,
          scale: 1.1,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-900/70 to-pink-900/70" />

      {/* Content */}
      <motion.div
        className="relative h-full flex flex-col items-center justify-center text-center px-4"
        style={{ opacity }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {content.title}
        </motion.h1>

        <motion.p
          className="text-xl text-white/90 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {content.description}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
            <Search className="mr-2 h-5 w-5" />
            {content.buttons.search}
          </Button>
          <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white">
            <Heart className="mr-2 h-5 w-5" />
            {content.buttons.help}
          </Button>
        </motion.div>
      </motion.div>

      {/* Wave shape divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="dark:fill-gray-900"
          ></path>
        </svg>
      </div>
    </div>
  )
}


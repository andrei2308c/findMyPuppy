"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"

interface CounterProps {
  end: string
  duration?: number
}

function Counter({ end, duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0)
  const nodeRef = useRef(null)
  const isInView = useInView(nodeRef, { once: true, amount: 0.5 })

  // Extract numeric part and suffix
  const numericPart = Number.parseInt(end.replace(/[^0-9]/g, ""), 10)
  const suffix = end.replace(/[0-9]/g, "")

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const startAnimation = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * numericPart))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(startAnimation)
      }
    }

    animationFrame = requestAnimationFrame(startAnimation)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [numericPart, duration, isInView])

  return (
    <span ref={nodeRef} className="text-4xl md:text-5xl font-bold">
      {count}
      {suffix}
    </span>
  )
}

interface StatsProps {
  content: {
    items: {
      value: string
      label: string
    }[]
  }
}

export default function StatsSection({ content }: StatsProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.items.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center"
            >
              <Counter end={stat.value} />
              <p className="text-gray-600 dark:text-gray-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


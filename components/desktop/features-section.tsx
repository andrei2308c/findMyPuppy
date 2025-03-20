"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface FeatureItem {
  icon: LucideIcon
  title: string
  description: string
  color: string
}

interface FeaturesProps {
  content: {
    title: string
    description: string
    items: FeatureItem[]
  }
}

export default function FeaturesSection({ content }: FeaturesProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {content.items.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div key={index} variants={item} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

                <div className="relative h-full backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} rounded-full opacity-10 -mr-10 -mt-10`}
                  />

                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}


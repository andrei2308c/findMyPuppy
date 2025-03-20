"use client"

import { useDesktop } from "@/hooks/use-desktop"
import DesktopLayout from "@/components/desktop/layout"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useTranslation } from "@/lib/i18n/client"
import { aboutData } from "@/lib/data/about-data"

// Dynamically import the mobile app
const MobileApp = dynamic(
  () =>
    import("@/components/map-component").then((mod) => {
      return () => (
        <div className="relative w-full h-[100dvh] overflow-hidden">
          <mod.default />
        </div>
      )
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-[100dvh] bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    ),
  },
)

export default function AboutPage() {
  const isDesktop = useDesktop()
  const [mounted, setMounted] = useState(false)
  const { locale } = useTranslation()

  // Get localized content
  const content = aboutData[locale as keyof typeof aboutData] || aboutData.en

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Show mobile app on mobile devices
  if (!isDesktop) {
    return <MobileApp />
  }

  return (
    <DesktopLayout>
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                {content.hero.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{content.hero.description}</p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{content.hero.story}</p>
              <div className="flex items-center gap-4">
                <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></div>
                <p className="text-xl font-semibold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  {content.hero.since}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1886&auto=format&fit=crop"
                  alt="Happy dog reunited with owner"
                  className="relative z-10 rounded-2xl shadow-xl w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {content.values.title}
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {content.values.description}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.values.items.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${value.color} text-white mb-4`}>
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              {content.team.title}
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {content.team.description}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.team.members.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-orange-500 dark:text-orange-400 mb-4">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </DesktopLayout>
  )
}


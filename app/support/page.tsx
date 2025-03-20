"use client"

import { useDesktop } from "@/hooks/use-desktop"
import DesktopLayout from "@/components/desktop/layout"
import { motion } from "framer-motion"
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useTranslation } from "@/lib/i18n/client"
import { donationPlansData, faqData } from "@/lib/data/support-data"

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

// FAQ Item component
interface FAQItemProps {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        className="flex w-full items-center justify-between py-4 text-left text-lg font-medium text-gray-900 dark:text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-orange-500 dark:text-orange-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pb-4 text-gray-600 dark:text-gray-400">{answer}</div>
      </motion.div>
    </div>
  )
}

export default function SupportPage() {
  const isDesktop = useDesktop()
  const [mounted, setMounted] = useState(false)
  const { t, locale } = useTranslation()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Show mobile app on mobile devices
  if (!isDesktop) {
    return <MobileApp />
  }

  // Donation plans
  const donationPlans = donationPlansData[locale as keyof typeof donationPlansData]
  // FAQ items
  const faqItems = faqData[locale as keyof typeof faqData]

  return (
    <DesktopLayout>
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t("desktop.support.title")}
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t("desktop.support.description")}
            </motion.p>
          </div>

          {/* Donation Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {donationPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${plan.highlighted ? "transform md:-translate-y-4" : ""}`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 inset-x-0 transform -translate-y-6 flex justify-center">
                    <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-medium px-4 py-1 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div
                  className={`h-full backdrop-blur-sm ${plan.highlighted ? "bg-white/70 dark:bg-gray-800/70 shadow-xl" : "bg-white/50 dark:bg-gray-800/50"} border ${plan.highlighted ? "border-orange-200 dark:border-orange-900/30" : "border-gray-200 dark:border-gray-700"} rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.color} text-white mb-4`}>
                    <plan.icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{plan.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>

                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{plan.price}</p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button className={`w-full bg-gradient-to-r ${plan.color} text-white hover:shadow-lg`}>
                    {plan.buttonText}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Install App Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 mb-20"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {t("desktop.support.installApp.title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{t("desktop.support.installApp.description")}</p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                      <svg
                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 18.178C12.2749 18.178 12.5 17.9529 12.5 17.678V12.5H17.678C17.9529 12.5 18.178 12.2749 18.178 12C18.178 11.7251 17.9529 11.5 17.678 11.5H12.5V6.32197C12.5 6.04707 12.2749 5.82197 12 5.82197C11.7251 5.82197 11.5 6.04707 11.5 6.32197V11.5H6.32197C6.04707 11.5 5.82197 11.7251 5.82197 12C5.82197 12.2749 6.04707 12.5 6.32197 12.5H11.5V17.678C11.5 17.9529 11.7251 18.178 12 18.178Z"
                          fill="currentColor"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {t("desktop.support.installApp.ios.title")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t("desktop.support.installApp.ios.description")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                      <svg
                        className="h-5 w-5 text-green-600 dark:text-green-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 18.178C12.2749 18.178 12.5 17.9529 12.5 17.678V12.5H17.678C17.9529 12.5 18.178 12.2749 18.178 12C18.178 11.7251 17.9529 11.5 17.678 11.5H12.5V6.32197C12.5 6.04707 12.2749 5.82197 12 5.82197C11.7251 5.82197 11.5 6.04707 11.5 6.32197V11.5H6.32197C6.04707 11.5 5.82197 11.7251 5.82197 12C5.82197 12.2749 6.04707 12.5 6.32197 12.5H11.5V17.678C11.5 17.9529 11.7251 18.178 12 18.178Z"
                          fill="currentColor"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {t("desktop.support.installApp.android.title")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t("desktop.support.installApp.android.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                  <img
                    src="/placeholder.svg?height=300&width=300&text=App+Screenshot"
                    alt="App Screenshot"
                    className="relative z-10 rounded-2xl shadow-xl w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <motion.h2
                className="text-3xl font-semibold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {t("desktop.support.faq.title")}
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t("desktop.support.faq.description")}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8"
            >
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {faqItems.map((item, index) => (
                  <FAQItem key={index} question={item.question} answer={item.answer} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Need More Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white mb-4">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              {t("desktop.support.needHelp.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              {t("desktop.support.needHelp.description")}
            </p>
            <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
              {t("desktop.support.needHelp.buttonText")}
            </Button>
          </motion.div>
        </div>
      </section>
    </DesktopLayout>
  )
}


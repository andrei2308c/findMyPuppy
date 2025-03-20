"use client"

import type React from "react"

import { useDesktop } from "@/hooks/use-desktop"
import DesktopLayout from "@/components/desktop/layout"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { submitContactForm } from "@/lib/utils/forms"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "@/lib/i18n/client"

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

export default function ContactPage() {
  const isDesktop = useDesktop()
  const [mounted, setMounted] = useState(false)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslation()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Show mobile app on mobile devices
  if (!isDesktop) {
    return <MobileApp />
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("Submitting form:", formState)
      const result = await submitContactForm(formState)

      if (result.success) {
        toast({
          title: t("contact.form.success"),
          description: t("contact.form.successDesc"),
        })
        setSubmitSuccess(true)
        setFormState({
          name: "",
          email: "",
          subject: "",
          description: "",
        })

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false)
        }, 5000)
      } else {
        throw new Error("Failed to submit contact form")
      }
    } catch (error) {
      console.error("Error submitting contact form:", error)
      toast({
        title: t("contact.form.error"),
        description: t("contact.form.errorDesc"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
              {t("desktop.contact.title")}
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t("desktop.contact.description")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">{t("contact.form.send")}</h2>

                {submitSuccess ? (
                  <motion.div
                    className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-lg mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      {t("contact.form.successDesc")}
                    </p>
                  </motion.div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t("contact.form.name")}
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="bg-white/70 dark:bg-gray-900/70 border-gray-300 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        {t("contact.form.email")}
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="bg-white/70 dark:bg-gray-900/70 border-gray-300 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      {t("contact.form.subject")}
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      className="bg-white/70 dark:bg-gray-900/70 border-gray-300 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      {t("contact.form.message")}
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={5}
                      value={formState.description}
                      onChange={handleChange}
                      required
                      className="bg-white/70 dark:bg-gray-900/70 border-gray-300 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t("contact.form.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t("contact.form.send")}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-8"
            >
              <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                  {t("desktop.contact.info.title")}
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-pink-500 p-3 rounded-lg text-white">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {t("desktop.contact.info.email")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">contact@findmypuppy.com</p>
                      <p className="text-gray-600 dark:text-gray-400">support@findmypuppy.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-pink-500 p-3 rounded-lg text-white">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {t("desktop.contact.info.phone")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">+40 123 456 789</p>
                      <p className="text-gray-600 dark:text-gray-400">Monday-Friday, 9AM-5PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-pink-500 p-3 rounded-lg text-white">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {t("desktop.contact.info.office")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">123 Pet Street, Bucharest</p>
                      <p className="text-gray-600 dark:text-gray-400">Romania, 010101</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                  {t("desktop.contact.social.title")}
                </h2>

                <div className="flex gap-4">
                  <a
                    href="#"
                    className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>

                  <a
                    href="#"
                    className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-lg text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>

                  <a
                    href="#"
                    className="bg-gradient-to-br from-blue-400 to-cyan-500 p-3 rounded-lg text-white hover:from-blue-500 hover:to-cyan-600 transition-all duration-300"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>

                  <a
                    href="#"
                    className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-lg text-white hover:from-red-600 hover:to-red-700 transition-all duration-300"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="h-96 w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d91158.11409039594!2d26.03030565!3d44.439121299999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f93abf3cad4f%3A0xac0632e37c9ca628!2sBucharest%2C%20Romania!5e0!3m2!1sen!2sus!4v1647881760889!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </DesktopLayout>
  )
}


"use client"

import { useTranslation } from "@/lib/i18n/client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import {
  Mail,
  Heart,
  X,
  Map,
  PawPrintIcon as Paw,
  Users,
  Gift,
  Bug,
  CreditCard,
  RefreshCcw,
  Search,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useMapContext } from "@/lib/contexts/MapContext"
import NearbyPetsList from "./nearby-pets-list"
import SocialShare from "./social-share"
import { submitBugReport } from "@/lib/utils/forms"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

// Import useTheme at the top with other imports
import { useTheme } from "next-themes"

interface SidePanelProps {
  isOpen: boolean
  onClose: () => void
}

// Add the useTheme hook in the component
export default function SidePanel({ isOpen, onClose }: SidePanelProps) {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("home")
  const [showBugReport, setShowBugReport] = useState(false)
  const [bugReport, setBugReport] = useState("")
  const [isSubmittingBug, setIsSubmittingBug] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [showInstallDropdown, setShowInstallDropdown] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { setMapMode } = useMapContext()

  // Add useEffect to handle mounted state for theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Detect if we're on desktop
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024) // lg breakpoint
    }

    checkIfDesktop()
    window.addEventListener("resize", checkIfDesktop)

    return () => {
      window.removeEventListener("resize", checkIfDesktop)
    }
  }, [])

  const handleSwitchToLostPets = () => {
    setMapMode("lost")
    onClose()
  }

  const handleSwitchToFoundPets = () => {
    setMapMode("found")
    onClose()
  }

  // Inside the SidePanel component, update the handleSubmitBugReport function:
  const handleSubmitBugReport = async () => {
    if (!bugReport.trim()) return

    setIsSubmittingBug(true)

    try {
      const result = await submitBugReport(bugReport)

      if (result.success) {
        // Reset form and close
        setBugReport("")
        setShowBugReport(false)

        toast({
          title: t("bugReport.success"),
          description: t("bugReport.successDesc"),
        })
      } else {
        throw new Error("Failed to submit bug report")
      }
    } catch (error) {
      console.error("Error submitting bug report:", error)
      toast({
        title: t("bugReport.error"),
        description: t("bugReport.errorDesc"),
        variant: "destructive",
      })
    } finally {
      setIsSubmittingBug(false)
    }
  }

  // Handle tab switching for the "Add to Home Screen" section
  const iosTabRef = useRef<HTMLButtonElement>(null)
  const androidTabRef = useRef<HTMLButtonElement>(null)
  const iosContentRef = useRef<HTMLDivElement>(null)
  const androidContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleTabClick = () => {
      if (!iosTabRef.current || !androidTabRef.current || !iosContentRef.current || !androidContentRef.current) return

      iosTabRef.current.addEventListener("click", () => {
        // Update tab styles
        iosTabRef.current!.className =
          "flex-1 py-2 px-3 text-sm font-medium border-b-2 border-indigo-500 text-indigo-600 bg-white"
        androidTabRef.current!.className = "flex-1 py-2 px-3 text-sm font-medium text-gray-500 hover:text-gray-700"

        // Show/hide content
        iosContentRef.current!.classList.remove("hidden")
        androidContentRef.current!.classList.add("hidden")
      })

      androidTabRef.current.addEventListener("click", () => {
        // Update tab styles
        androidTabRef.current!.className =
          "flex-1 py-2 px-3 text-sm font-medium border-b-2 border-indigo-500 text-indigo-600 bg-white"
        iosTabRef.current!.className = "flex-1 py-2 px-3 text-sm font-medium text-gray-500 hover:text-gray-700"

        // Show/hide content
        androidContentRef.current!.classList.remove("hidden")
        iosContentRef.current!.classList.add("hidden")
      })
    }

    if (activeTab === "support") {
      // Use setTimeout to ensure the DOM elements are rendered
      setTimeout(handleTabClick, 100)
    }
  }, [activeTab])

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="left"
        className={`p-0 overflow-y-auto ${isDesktop ? "w-1/3 max-w-[33.333%]" : "w-full sm:max-w-full"}`}
      >
        {/* Header with app name and close button */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
          <SheetHeader className="flex flex-row justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Find My Puppy Logo"
                width={240} // Increased intrinsic size
                height={240} // Increased intrinsic size
                className="h-20 w-auto"
              />{" "}
              <SheetTitle className="text-xl font-bold">{t("appName")}</SheetTitle>
            </div>
            <div className="flex items-center gap-1">
              {/* {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-8 w-8"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              )} */}
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <X className="h-7 w-7" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
        </div>

        {/* Fancy Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-muted/50">
          {[
            { id: "home", icon: <Map className="h-5 w-5" />, color: "from-amber-400 to-orange-500" },
            { id: "about", icon: <Users className="h-5 w-5" />, color: "from-blue-500 to-indigo-600" },
            { id: "contact", icon: <Mail className="h-5 w-5" />, color: "from-amber-500 to-orange-600" },
            { id: "support", icon: <Gift className="h-5 w-5" />, color: "from-pink-500 to-rose-600" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? `bg-gradient-to-br ${tab.color} text-white shadow-md scale-105`
                  : "hover:bg-muted"
              }`}
            >
              {tab.icon}
              <span className="text-xs mt-1 font-medium">{t(`menu.${tab.id}.tabName`)}</span>
            </button>
          ))}
        </div>

        {/* Tab Content with animations */}
        <div className="p-4">
          {activeTab === "home" && (
            <div className="space-y-4 animate-in slide-in-from-left duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-full">
                  <Map className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  {t("menu.home.title")}
                </h3>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                <p className="text-muted-foreground">{t("menu.home.description")}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-4">
                {/* Lost Pets Button - styled like map buttons */}
                <button
                  onClick={handleSwitchToLostPets}
                  className="px-4 py-3 rounded-full shadow-lg transition-all duration-300 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white flex items-center gap-3"
                >
                  <Search className="h-5 w-5" />
                  <div className="text-left">
                    <h4 className="font-medium">{t("menu.home.feature1.title")}</h4>
                    <p className="text-xs text-white/80 mt-1">{t("menu.home.feature1.desc")}</p>
                  </div>
                </button>

                {/* Help Others Button - styled like map buttons */}
                <button
                  onClick={handleSwitchToFoundPets}
                  className="px-4 py-3 rounded-full shadow-lg transition-all duration-300 bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500 text-white flex items-center gap-3"
                >
                  <Heart className="h-5 w-5" />
                  <div className="text-left">
                    <h4 className="font-medium">{t("menu.home.feature2.title")}</h4>
                    <p className="text-xs text-white/80 mt-1">{t("menu.home.feature2.desc")}</p>
                  </div>
                </button>
              </div>

              {/* Lost Pets List Section - Now using our dedicated component */}
              <NearbyPetsList onPinClick={onClose} />

              <Button
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-full shadow-lg"
                onClick={onClose}
              >
                {t("menu.home.backToMap")}
              </Button>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-4 animate-in slide-in-from-left duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  {t("menu.about.title")}
                </h3>
              </div>

              <div className="relative">
                <div className="h-40 rounded-t-lg bg-gradient-to-r from-blue-500/20 to-indigo-600/20 flex items-center justify-center">
                  <Paw className="h-16 w-16 text-blue-500" />
                </div>
                <div className="bg-muted/30 rounded-b-lg p-4 border border-muted">
                  <p className="text-muted-foreground">{t("menu.about.description")}</p>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-muted">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Heart className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{t("menu.about.mission.title")}</h4>
                    <p className="text-xs text-muted-foreground">{t("menu.about.mission.desc")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-muted">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{t("menu.about.team.title")}</h4>
                    <p className="text-xs text-muted-foreground">{t("menu.about.team.desc")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-4 animate-in slide-in-from-left duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                  {t("menu.contact.title")}
                </h3>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                <p className="text-muted-foreground">{t("menu.contact.description")}</p>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-500/10 to-orange-600/10 rounded-lg border border-amber-200/20">
                  <Mail className="h-5 w-5 text-amber-500" />
                  <a href="mailto:re.hyped2023@gmail.com" className="font-medium">
                    re.hyped2023@gmail.com
                  </a>
                </div>

                {/* Report Bug Icon Button */}
                <div className="flex justify-center mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBugReport(!showBugReport)}
                    className="flex items-center gap-2 border-amber-200/50 hover:bg-amber-50"
                  >
                    <Bug className="h-4 w-4 text-amber-500" />
                    <span className="text-xs">{t("menu.contact.reportBug")}</span>
                  </Button>
                </div>

                {/* Bug Report Form */}
                {showBugReport && (
                  <div className="p-3 border border-amber-200/20 rounded-lg bg-amber-50/30 animate-in fade-in duration-300">
                    <Textarea
                      placeholder={t("menu.contact.bugDescription")}
                      className="bg-white/80 resize-none mb-3 text-sm"
                      rows={3}
                      value={bugReport}
                      onChange={(e) => setBugReport(e.target.value)}
                    />
                    <Button
                      size="sm"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      onClick={handleSubmitBugReport}
                      disabled={isSubmittingBug || !bugReport.trim()}
                    >
                      {isSubmittingBug ? (
                        <span className="flex items-center gap-1">
                          <svg
                            className="animate-spin h-3 w-3 text-white"
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
                          {t("bugReport.submitting")}
                        </span>
                      ) : (
                        t("menu.contact.submitReport")
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "support" && (
            <div className="space-y-4 animate-in slide-in-from-left duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-full">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                  {t("menu.support.title")}
                </h3>
              </div>

              <div className="relative overflow-hidden rounded-lg">
                <div className="h-40 bg-gradient-to-r from-pink-500/20 to-rose-600/20 flex items-center justify-center">
                  <Heart className="h-16 w-16 text-pink-500" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg max-w-[80%] text-center">
                    <h4 className="font-bold text-lg">{t("menu.support.helpUs")}</h4>
                    <p className="text-sm text-muted-foreground">{t("menu.support.description")}</p>
                  </div>
                </div>
              </div>

              <a
                href="https://buymeacoffee.com/findyourpuppy"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 rounded-full">
                  <Gift className="h-4 w-4 mr-2" />
                  {t("menu.support.donate")}
                </Button>
              </a>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-muted/30 p-3 rounded-lg border border-muted flex flex-col items-center text-center">
                  <CreditCard className="h-6 w-6 text-pink-500 mb-2" />
                  <h4 className="text-sm font-medium">{t("menu.support.oneTime")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{t("menu.support.oneTimeDesc")}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-muted flex flex-col items-center text-center">
                  <RefreshCcw className="h-6 w-6 text-pink-500 mb-2" />
                  <h4 className="text-sm font-medium">{t("menu.support.monthly")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{t("menu.support.monthlyDesc")}</p>
                </div>
              </div>

              <SocialShare url={""} title={""} />

              {/* Install as Mobile App Button and Dropdown */}
              <div className="mt-4">
                <Button
                  onClick={() => setShowInstallDropdown(!showInstallDropdown)}
                  className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-full flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 3v18" />
                    <path d="M14 9l3 3-3 3" />
                  </svg>
                  {t("menu.support.installApp")}
                </Button>

                {showInstallDropdown && (
                  <div className="mt-3 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100 animate-in slide-in-from-top duration-300">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex border-b border-gray-200">
                        <button
                          className="flex-1 py-2 px-3 text-sm font-medium border-b-2 border-indigo-500 text-indigo-600 bg-white"
                          id="ios-tab"
                          ref={iosTabRef}
                        >
                          {t("menu.support.iosTab")}
                        </button>
                        <button
                          className="flex-1 py-2 px-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                          id="android-tab"
                          ref={androidTabRef}
                        >
                          {t("menu.support.androidTab")}
                        </button>
                      </div>

                      <div id="ios-content" className="pt-3" ref={iosContentRef}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-gray-100 p-1 rounded">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-500"
                            >
                              <path d="M9 12h6" />
                              <path d="M12 9v6" />
                              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">{t("menu.support.step1")}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{t("menu.support.iosStep1")}</p>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-gray-100 p-1 rounded">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-500"
                            >
                              <path d="M12 5v14" />
                              <path d="m19 12-7 7-7-7" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">{t("menu.support.step2")}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{t("menu.support.iosStep2")}</p>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-gray-100 p-1 rounded">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-500"
                            >
                              <path d="M5 12h14" />
                              <path d="M12 5v14" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">{t("menu.support.step3")}</span>
                        </div>
                        <p className="text-xs text-gray-600">{t("menu.support.iosStep3")}</p>

                        <div className="mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <img
                            src="/placeholder.svg?height=100&width=200&text=iOS+Add+to+Home"
                            alt="iOS Add to Home Screen"
                            className="w-full h-auto rounded"
                          />
                        </div>
                      </div>

                      <div id="android-content" className="pt-3 hidden" ref={androidContentRef}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-gray-100 p-1 rounded">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-500"
                            >
                              <path d="M9 12h6" />
                              <path d="M12 9v6" />
                              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">{t("menu.support.step1")}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{t("menu.support.androidStep1")}</p>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-gray-100 p-1 rounded">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-500"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">{t("menu.support.step2")}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{t("menu.support.androidStep2")}</p>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-gray-100 p-1 rounded">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-500"
                            >
                              <path d="M5 12h14" />
                              <path d="M12 5v14" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">{t("menu.support.step3")}</span>
                        </div>
                        <p className="text-xs text-gray-600">{t("menu.support.androidStep3")}</p>

                        <div className="mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <img
                            src="/placeholder.svg?height=100&width=200&text=Android+Add+to+Home"
                            alt="Android Add to Home Screen"
                            className="w-full h-auto rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 mt-auto border-t">
          <p className="text-xs text-center text-muted-foreground">{t("footerText")} &copy; 2025</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}


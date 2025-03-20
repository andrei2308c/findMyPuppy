"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "@/lib/i18n/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  MapPin,
  PawPrintIcon as Paw,
  Phone,
  User,
  X,
  UserIcon as Male,
  UserIcon as Female,
  HelpCircle,
  Plus,
} from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import type { PinData } from "@/lib/types"
import { useMapContext } from "@/lib/contexts/MapContext"
import { addPin, uploadPhotoToStorage } from "@/lib/pinUtils"
import { motion, AnimatePresence } from "framer-motion"

interface AddPinModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddPinModal({ isOpen, onClose }: AddPinModalProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { mapMode, userLocation, refreshPins, isPinPlacementMode, setIsPinPlacementMode, draftPin, setDraftPin } =
    useMapContext()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dogName, setDogName] = useState("")
  const [description, setDescription] = useState("")
  const [gender, setGender] = useState("Male")
  const [size, setSize] = useState("Medium")
  const [color, setColor] = useState("")
  const [reporterName, setReporterName] = useState("")
  const [reporterPhone, setReporterPhone] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Limit to 3 images total
      const totalImages = [...images, ...newFiles].slice(0, 3)
      setImages(totalImages)

      // Create previews for all images
      const newPreviews = [...imagePreviews]

      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (newPreviews.length < 3) {
            newPreviews.push(reader.result as string)
            setImagePreviews([...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    const newPreviews = [...imagePreviews]

    newImages.splice(index, 1)
    newPreviews.splice(index, 1)

    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Use draft pin location if available, otherwise use user location
    const pinLocation = draftPin ? [draftPin.longitude, draftPin.latitude] : userLocation

    if (!pinLocation) {
      toast({
        title: t("addPin.locationError"),
        description: t("addPin.locationErrorDesc"),
        variant: "destructive",
      })
      return
    }

    if (!dogName.trim()) {
      toast({
        title: t("addPin.nameRequired"),
        description: t("addPin.nameRequiredDesc"),
        variant: "destructive",
      })
      return
    }

    if (!reporterName.trim() || !reporterPhone.trim()) {
      toast({
        title: t("addPin.contactRequired"),
        description: t("addPin.contactRequiredDesc"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setUploadProgress(10)

    try {
      // Upload all images to Supabase Storage
      const photoUrls: string[] = []

      if (images.length > 0) {
        // Upload each image and track progress
        const totalImages = images.length
        for (let i = 0; i < totalImages; i++) {
          const file = images[i]
          const url = await uploadPhotoToStorage(file)
          if (url) {
            photoUrls.push(url)
          }
          // Update progress after each upload
          setUploadProgress(10 + Math.floor(((i + 1) / totalImages) * 60))
        }
      }

      setUploadProgress(70)

      // Create the new pin object
      const newPin: PinData = {
        id: Date.now().toString(),
        dogName: dogName,
        description: description,
        longitude: pinLocation[0],
        latitude: pinLocation[1],
        gender: gender,
        size: size,
        color: color || "Unknown",
        reporterName: reporterName,
        reporterPhone: reporterPhone,
        photos: photoUrls, // Use the uploaded image URLs
        createdAt: new Date().toISOString(),
      }

      setUploadProgress(80)

      // Add the pin to the database
      const result = await addPin(newPin, mapMode)

      setUploadProgress(100)

      if (!result) {
        throw new Error("Failed to add pin to database")
      }

      toast({
        title: t("addPin.success"),
        description: t("addPin.successDesc"),
      })

      // Reset form
      setDogName("")
      setDescription("")
      setGender("Male")
      setSize("Medium")
      setColor("")
      setReporterName("")
      setReporterPhone("")
      setImages([])
      setImagePreviews([])
      setUploadProgress(0)
      setCurrentStep(1)

      // Clear the draft pin
      setDraftPin(null)

      // Refresh pins
      await refreshPins()

      // Close modal
      onClose()
    } catch (error) {
      console.error("Error adding pin:", error)
      toast({
        title: t("addPin.error"),
        description: typeof error === "string" ? error : t("addPin.errorDesc"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Check if current step is valid to proceed
  const isStepValid = () => {
    if (currentStep === 1) {
      return dogName.trim() !== "" && description.trim() !== ""
    }
    if (currentStep === 2) {
      return true // Gender, size, and color are pre-filled or optional
    }
    return reporterName.trim() !== "" && reporterPhone.trim() !== ""
  }

  const handleSelectOnMap = () => {
    // Enable pin placement mode
    setIsPinPlacementMode(true)

    // Close the modal
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1], // Custom ease curve for a nice accordion effect
            }}
            className="relative bg-white rounded-xl overflow-auto w-full max-w-md mx-4 shadow-2xl max-h-[75vh]"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="fixed right-3 top-3 z-50 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div
              className={`bg-gradient-to-r ${mapMode === "lost" ? "from-amber-400 to-orange-500" : "from-pink-300 to-pink-500"} p-4 text-white`}
            >
              <h2 className="text-xl font-bold flex items-center">
                <Paw className="h-5 w-5 mr-2" />
                {mapMode === "lost" ? t("addPin.title") : t("addPin.titleFound")}
              </h2>

              {/* Progress indicator */}
              <div className="flex items-center mt-4">
                <div className="flex-1 bg-white/30 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-3 text-sm font-medium">
                  {currentStep}/{totalSteps}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-3">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">{t("addPin.petDetails")}</h3>

                  {/* Pet Images */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-700">{t("addPin.image")}</h4>
                      {imagePreviews.length < 3 && (
                        <label
                          htmlFor="image"
                          className="inline-flex items-center justify-center p-1 rounded-full bg-orange-100 hover:bg-orange-200 cursor-pointer transition-colors"
                        >
                          <Plus className="h-4 w-4 text-orange-600" />
                          <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            multiple={imagePreviews.length < 2}
                          />
                        </label>
                      )}
                    </div>

                    {imagePreviews.length > 0 ? (
                      <div className="relative rounded-lg overflow-hidden bg-gray-50">
                        <Carousel className="w-full">
                          <CarouselContent>
                            {imagePreviews.map((preview, index) => (
                              <CarouselItem key={index}>
                                <div className="relative h-40 rounded-lg overflow-hidden">
                                  <img
                                    src={preview || "/placeholder.svg"}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                                    onClick={() => removeImage(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                        </Carousel>
                      </div>
                    ) : null}
                  </div>

                  {/* Pet Name */}
                  <div className="space-y-2">
                    <Label htmlFor="dogName" className="text-sm font-medium text-gray-700">
                      {t("addPin.dogName")} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dogName"
                      value={dogName}
                      onChange={(e) => setDogName(e.target.value)}
                      placeholder={t("addPin.dogNamePlaceholder")}
                      className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      {t("addPin.description")} <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t("addPin.descriptionPlaceholder")}
                      rows={3}
                      maxLength={400}
                      className="resize-none border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                    <div className="text-xs text-gray-500 text-right">{description.length}/400</div>
                  </div>
                </div>
              )}

              {/* Step 2: Pet Characteristics */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    {t("addPin.petDetails")} - {t("addPin.characteristics")}
                  </h3>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">{t("addPin.gender")}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setGender("Male")}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm ${
                          gender === "Male"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <Male className="h-4 w-4" />
                        <span>{t("addPin.male")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender("Female")}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm ${
                          gender === "Female"
                            ? "bg-pink-50 text-pink-700 border border-pink-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <Female className="h-4 w-4" />
                        <span>{t("addPin.female")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender("Unknown")}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm ${
                          gender === "Unknown"
                            ? "bg-gray-200 text-gray-800 border border-gray-300"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <HelpCircle className="h-4 w-4" />
                        <span>{t("addPin.unknown")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Size */}
                  <div className="space-y-2">
                    <Label htmlFor="size" className="text-sm font-medium text-gray-700">
                      {t("addPin.size")}
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSize("Small")}
                        className={`py-2 px-3 rounded-lg text-sm ${
                          size === "Small"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {t("addPin.small")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSize("Medium")}
                        className={`py-2 px-3 rounded-lg text-sm ${
                          size === "Medium"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {t("addPin.medium")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSize("Large")}
                        className={`py-2 px-3 rounded-lg text-sm ${
                          size === "Large"
                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {t("addPin.large")}
                      </button>
                    </div>
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <Label htmlFor="color" className="text-sm font-medium text-gray-700">
                      {t("addPin.color")}
                    </Label>
                    <Input
                      id="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder={t("addPin.colorPlaceholder")}
                      className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">{t("addPin.contactInfo")}</h3>

                  {/* Reporter Name */}
                  <div className="space-y-2">
                    <Label htmlFor="reporterName" className="text-sm font-medium text-gray-700">
                      {t("addPin.reporterName")} <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="reporterName"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder={t("addPin.reporterNamePlaceholder")}
                        className="pl-10 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Reporter Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="reporterPhone" className="text-sm font-medium text-gray-700">
                      {t("addPin.reporterPhone")} <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="reporterPhone"
                        value={reporterPhone}
                        onChange={(e) => setReporterPhone(e.target.value)}
                        placeholder={t("addPin.reporterPhonePlaceholder")}
                        className="pl-10 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">{t("addPin.location")}</Label>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleSelectOnMap}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors w-full"
                      >
                        <div className="bg-amber-100 p-2 rounded-full">
                          <MapPin className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-800">{t("addPin.selectOnMap")}</p>
                          <p className="text-xs text-gray-500">{t("addPin.dragPinToLocation")}</p>
                        </div>
                      </button>

                      {userLocation && (
                        <button
                          type="button"
                          onClick={() => {}}
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors w-full"
                        >
                          <div className="bg-amber-100 p-2 rounded-full">
                            <MapPin className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-800">{t("addPin.usingCurrentLocation")}</p>
                            <p className="text-xs text-gray-500">
                              {userLocation[1].toFixed(6)}, {userLocation[0].toFixed(6)}
                            </p>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Upload Progress Bar - shown only when submitting */}
                  {isSubmitting && uploadProgress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{t("addPin.uploading")}</span>
                        <span className="text-xs font-medium text-gray-700">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="px-4 border-gray-300 text-gray-700"
                    disabled={isSubmitting}
                  >
                    {t("back")}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="px-4 border-gray-300 text-gray-700"
                    disabled={isSubmitting}
                  >
                    {t("cancel")}
                  </Button>
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={`px-4 bg-gradient-to-r ${
                      mapMode === "lost"
                        ? "from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600"
                        : "from-pink-300 to-pink-500 hover:from-pink-400 hover:to-pink-600"
                    } text-white`}
                    disabled={!isStepValid() || isSubmitting}
                  >
                    {t("next")}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className={`px-4 bg-gradient-to-r ${
                      mapMode === "lost"
                        ? "from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600"
                        : "from-pink-300 to-pink-500 hover:from-pink-400 hover:to-pink-600"
                    } text-white`}
                    disabled={!isStepValid() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-1">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
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
                        {t("addPin.submitting")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        {mapMode === "lost" ? t("addPin.submit") : t("addPin.submitFound")}
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}


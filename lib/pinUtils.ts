import { supabase } from "@/lib/supabaseClient"
import type { PinData } from "@/lib/types"

// Helper function to get the correct table name based on map mode
const getTableName = (mapMode: "lost" | "found"): string => {
  return mapMode === "lost" ? "pins" : "pins-found"
}

// Upload a photo to Supabase Storage
export const uploadPhotoToStorage = async (file: File): Promise<string | null> => {
  try {
    // Generate a unique filename to avoid collisions
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `pet-photos/${fileName}`

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage.from("pet-photos").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return null
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("pet-photos").getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error("Error in uploadPhotoToStorage:", error)
    return null
  }
}

// Fetch pins based on map mode
export const fetchPins = async (mapMode: "lost" | "found", onPinsLoaded?: (pins: PinData[]) => void) => {
  try {
    const tableName = getTableName(mapMode)

    const { data, error } = await supabase.from(tableName).select("*")

    console.log(`Fetched ${mapMode} pins:`, data)

    if (error) {
      console.error(`Error fetching ${mapMode} pins:`, error)
      return []
    }

    if (onPinsLoaded && data) {
      onPinsLoaded(data)
    }

    return data || []
  } catch (error) {
    console.error(`Failed to fetch ${mapMode} pins:`, error)
    return []
  }
}

// Add pins to map
export const addPinsToMap = (
  pinsData: PinData[],
  mapMode: "lost" | "found",
  updateMapWithPins: (pins: PinData[], mode: "lost" | "found") => void,
) => {
  updateMapWithPins(pinsData, mapMode)
}

// Add a new pin to the appropriate table based on map mode
export const addPin = async (pin: PinData, mapMode: "lost" | "found" = "lost") => {
  try {
    const tableName = getTableName(mapMode)

    // Ensure photos is properly formatted as a string array for Supabase
    const pinData = {
      ...pin,
      photos: pin.photos || [], // Ensure photos is always an array
    }

    const { data, error } = await supabase.from(tableName).insert([pinData]).select()

    if (error) {
      console.error(`Error adding ${mapMode} pin:`, error)
      return null
    }

    console.log(`Successfully added ${mapMode} pin:`, data)
    return data
  } catch (error) {
    console.error(`Failed to add ${mapMode} pin:`, error)
    return null
  }
}

// Update an existing pin
export const updatePin = async (pin: PinData, mapMode: "lost" | "found" = "lost") => {
  try {
    const tableName = getTableName(mapMode)

    const { data, error } = await supabase.from(tableName).update(pin).eq("id", pin.id).select()

    if (error) {
      console.error(`Error updating ${mapMode} pin:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Failed to update ${mapMode} pin:`, error)
    return null
  }
}

// Delete a pin
export const deletePin = async (pinId: string, mapMode: "lost" | "found" = "lost") => {
  try {
    const tableName = getTableName(mapMode)

    const { error } = await supabase.from(tableName).delete().eq("id", pinId)

    if (error) {
      console.error(`Error deleting ${mapMode} pin:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Failed to delete ${mapMode} pin:`, error)
    return false
  }
}


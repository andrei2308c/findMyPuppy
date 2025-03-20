import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { PinData } from "@/lib/types"

// In-memory storage for pins (in a real app, use a database)
const pins: PinData[] = []

export async function GET() {
  return NextResponse.json(pins)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const dogName = formData.get("dogName") as string
    const description = formData.get("description") as string
    const longitude = Number.parseFloat(formData.get("longitude") as string)
    const latitude = Number.parseFloat(formData.get("latitude") as string)
    const image = formData.get("image") as File | null

    // Validate required fields
    if (!dogName || !longitude || !latitude) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would upload the image to a storage service
    // and get back a URL. For this example, we'll simulate that.
    let imageUrl: string | undefined
    if (image) {
      // Simulate image upload and URL generation
      // In a real app, upload to S3, Cloudinary, etc.
      imageUrl = `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(dogName)}`
    }

    // Create new pin
    const newPin: PinData = {
      id: uuidv4(),
      dogName,
      description,
      longitude,
      latitude,
      imageUrl,
      createdAt: new Date().toISOString(),
    }

    // Add to our "database"
    pins.push(newPin)

    return NextResponse.json(newPin, { status: 201 })
  } catch (error) {
    console.error("Error creating pin:", error)
    return NextResponse.json({ message: "Error creating pin" }, { status: 500 })
  }
}


import type { PinData } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

// Generate random date within the last 7 days
const getRandomRecentDate = () => {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 7) // 0-7 days ago
  const hoursAgo = Math.floor(Math.random() * 24) // 0-24 hours ago
  const minutesAgo = Math.floor(Math.random() * 60) // 0-60 minutes ago

  now.setDate(now.getDate() - daysAgo)
  now.setHours(now.getHours() - hoursAgo)
  now.setMinutes(now.getMinutes() - minutesAgo)

  return now.toISOString()
}

// Generate a random point within a radius of a center point
const getRandomLocation = (centerLat: number, centerLng: number, radiusInKm: number) => {
  const radiusInDegrees = radiusInKm / 111 // roughly 111km per degree

  const u = Math.random()
  const v = Math.random()

  const w = radiusInDegrees * Math.sqrt(u)
  const t = 2 * Math.PI * v

  const x = w * Math.cos(t)
  const y = w * Math.sin(t)

  // Adjust the x-coordinate for the shrinking of the east-west distances
  const newX = x / Math.cos(centerLat * (Math.PI / 180))

  const newLng = newX + centerLng
  const newLat = y + centerLat

  return { latitude: newLat, longitude: newLng }
}

// Dog breeds for random generation
const dogBreeds = [
  "Labrador Retriever",
  "German Shepherd",
  "Golden Retriever",
  "Bulldog",
  "Beagle",
  "Poodle",
  "Rottweiler",
  "Yorkshire Terrier",
  "Boxer",
  "Dachshund",
  "Shih Tzu",
  "Siberian Husky",
  "Chihuahua",
  "Great Dane",
  "Doberman Pinscher",
]

// Dog colors
const dogColors = [
  "Black",
  "Brown",
  "White",
  "Tan",
  "Golden",
  "Gray",
  "Spotted",
  "Brindle",
  "Cream",
  "Red",
  "Black and Tan",
  "Black and White",
  "Tricolor",
]

// Dog sizes
const dogSizes = ["Small", "Medium", "Large"]

// Dog genders
const dogGenders = ["Male", "Female", "Unknown"]

// Generate a random dog description for lost pets
const generateLostDogDescription = () => {
  const breed = dogBreeds[Math.floor(Math.random() * dogBreeds.length)]
  const color = dogColors[Math.floor(Math.random() * dogColors.length)].toLowerCase()
  const gender = Math.random() > 0.5 ? "male" : "female"
  const age = Math.floor(Math.random() * 15) + 1 // 1-15 years

  const descriptions = [
    `${breed}, ${age} years old. Very friendly and responds to their name. Last seen wearing a ${Math.random() > 0.5 ? "red" : "blue"} collar.`,
    `${color.charAt(0).toUpperCase() + color.slice(1)} ${breed} with distinctive ${Math.random() > 0.5 ? "white patch on chest" : "scar on left ear"}. Very timid around strangers but loves treats.`,
    `${age} year old ${breed}. ${Math.random() > 0.5 ? "Microchipped" : "Not microchipped"}. Needs daily medication for a heart condition. Please call immediately if found.`,
    `Friendly ${breed} with ${color} fur. ${Math.random() > 0.5 ? "Wearing a collar with tags" : "No collar"}. Responds to whistling and the name "${dogNames[Math.floor(Math.random() * dogNames.length)]}".`,
    `Lost ${breed}, approximately ${age} years old. Has a distinctive ${Math.random() > 0.5 ? "limp in right back leg" : "bark"}. Very friendly with children and other dogs.`,
  ]

  return descriptions[Math.floor(Math.random() * descriptions.length)]
}

// Generate a random dog description for found pets
const generateFoundDogDescription = () => {
  const breed = dogBreeds[Math.floor(Math.random() * dogBreeds.length)]
  const color = dogColors[Math.floor(Math.random() * dogColors.length)].toLowerCase()
  const gender = Math.random() > 0.5 ? "male" : "female"
  const age = Math.floor(Math.random() * 15) + 1 // 1-15 years

  const descriptions = [
    `Found this ${color} ${breed} wandering near my neighborhood. ${Math.random() > 0.5 ? "Wearing a collar but no tags" : "No collar"}. Very friendly and well-behaved.`,
    `Found this ${breed} at the park. Seems to be about ${age} years old. ${Math.random() > 0.5 ? "Has a blue collar" : "No identification"}. Appears to be well-cared for and trained.`,
    `Found this ${color} dog that looks like a ${breed}. ${Math.random() > 0.5 ? "Has a microchip" : "No microchip found at vet"}. Currently staying with me until owner is found.`,
    `Found this sweet ${gender} ${breed} near the grocery store. ${Math.random() > 0.5 ? "Has a distinctive mark on its back" : "No distinctive markings"}. Very hungry when found but now doing well.`,
    `Found this ${breed} mix. Approximately ${age} years old. ${Math.random() > 0.5 ? "Limping slightly" : "Healthy condition"}. Responds to basic commands and is very affectionate.`,
  ]

  return descriptions[Math.floor(Math.random() * descriptions.length)]
}

// Generate random dog names
const dogNames = [
  "Max",
  "Bella",
  "Charlie",
  "Luna",
  "Cooper",
  "Lucy",
  "Buddy",
  "Daisy",
  "Rocky",
  "Lola",
  "Duke",
  "Sadie",
  "Bear",
  "Molly",
  "Leo",
  "Bailey",
  "Rex",
  "Rosie",
  "Teddy",
  "Ruby",
  "Milo",
  "Coco",
  "Oscar",
  "Lily",
]

// Generate random reporter names
const reporterNames = [
  "Alexandru Popescu",
  "Maria Ionescu",
  "Ion Popa",
  "Elena Dumitru",
  "Andrei Stanescu",
  "Ana Gheorghe",
  "Mihai Rusu",
  "Ioana Munteanu",
  "Cristian Stoica",
  "Daniela Matei",
  "Florin Ciobanu",
  "Gabriela Dinu",
]

// Generate random phone numbers (Romanian format)
const generatePhoneNumber = () => {
  const prefix = "07"
  const randomDigits = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0")
  return `${prefix}${randomDigits}`
}

// Generate random photos for dogs
const generateDogPhotos = (dogName: string) => {
  const numPhotos = Math.floor(Math.random() * 3) + 1 // 1-3 photos
  const photos = []

  // Real dog image URLs
  const dogImages = [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583511655826-05700442b31b?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534351450181-ea9f78427fe8?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=400&auto=format&fit=crop",
  ]

  // Select random images from the array
  const usedIndices = new Set()
  for (let i = 0; i < numPhotos; i++) {
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * dogImages.length)
    } while (usedIndices.has(randomIndex))

    usedIndices.add(randomIndex)
    photos.push(dogImages[randomIndex])
  }

  return photos
}

// Generate dummy lost pet pins around Bucharest
export const getDummyPins = (): PinData[] => {
  // Bucharest center coordinates
  const bucharestLat = 44.4268
  const bucharestLng = 26.1025

  const pins: PinData[] = []

  // Generate 15 random pins
  for (let i = 0; i < 15; i++) {
    const location = getRandomLocation(bucharestLat, bucharestLng, 5) // Within 5km radius
    const dogName = dogNames[Math.floor(Math.random() * dogNames.length)]
    const description = generateLostDogDescription()
    const gender = dogGenders[Math.floor(Math.random() * dogGenders.length)]
    const size = dogSizes[Math.floor(Math.random() * dogSizes.length)]
    const color = dogColors[Math.floor(Math.random() * dogColors.length)]
    const reporterName = reporterNames[Math.floor(Math.random() * reporterNames.length)]
    const reporterPhone = generatePhoneNumber()
    const photos = generateDogPhotos(dogName)

    pins.push({
      id: uuidv4(),
      dogName,
      description,
      latitude: location.latitude,
      longitude: location.longitude,
      gender,
      size,
      color,
      reporterName,
      reporterPhone,
      photos,
      createdAt: getRandomRecentDate(),
    })
  }

  return pins
}

// Generate dummy found pet pins around Bucharest
export const getDummyFoundPins = (): PinData[] => {
  // Bucharest center coordinates
  const bucharestLat = 44.4268
  const bucharestLng = 26.1025

  const pins: PinData[] = []

  // Generate 10 random pins
  for (let i = 0; i < 10; i++) {
    const location = getRandomLocation(bucharestLat, bucharestLng, 5) // Within 5km radius
    const dogName = "Unknown Dog " + (i + 1) // Found dogs often don't have names
    const description = generateFoundDogDescription()
    const gender = dogGenders[Math.floor(Math.random() * dogGenders.length)]
    const size = dogSizes[Math.floor(Math.random() * dogSizes.length)]
    const color = dogColors[Math.floor(Math.random() * dogColors.length)]
    const reporterName = reporterNames[Math.floor(Math.random() * reporterNames.length)]
    const reporterPhone = generatePhoneNumber()
    const photos = generateDogPhotos(dogName)

    pins.push({
      id: uuidv4(),
      dogName,
      description,
      latitude: location.latitude,
      longitude: location.longitude,
      gender,
      size,
      color,
      reporterName,
      reporterPhone,
      photos,
      createdAt: getRandomRecentDate(),
    })
  }

  return pins
}


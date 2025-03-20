"use client"

import { useDesktop } from "@/hooks/use-desktop"
import DesktopLayout from "@/components/desktop/layout"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { blogPosts } from "@/lib/data/blog-posts"
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

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar: string
  }
}

export default function BlogPage() {
  const isDesktop = useDesktop()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const { t, locale } = useTranslation()

  // Use the localized blog posts
  const posts = blogPosts[locale as keyof typeof blogPosts] || blogPosts.en

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Show mobile app on mobile devices
  if (!isDesktop) {
    return <MobileApp />
  }

  // Filter posts based on search query and selected category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === null || post.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Get all unique categories
  const categories = Array.from(new Set(posts.map((post) => post.category)))

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
              Pet Finder Blog
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Tips, stories, and resources to help you find or protect your pet.
            </motion.p>
          </div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/70 dark:bg-gray-900/70 border-gray-300 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  className={selectedCategory === null ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  All
                </Button>

                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/blog/${post.id}`} className="block h-full">
                  <div className="h-full backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        >
                          {post.category}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                      </div>

                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>

                      <div className="flex items-center">
                        <img
                          src={post.author.avatar || "/placeholder.svg"}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{post.author.name}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="inline-flex p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No results found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory(null)
                }}
                className="mt-4"
              >
                Clear filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </DesktopLayout>
  )
}


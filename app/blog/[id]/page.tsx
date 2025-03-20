"use client"

import { useDesktop } from "@/hooks/use-desktop"
import DesktopLayout from "@/components/desktop/layout"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { blogPosts } from "@/lib/data/blog-posts"
import { useTranslation } from "@/lib/i18n/client"
import SocialShare from "@/components/social-share"
import { useParams } from "next/navigation"

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

export default function BlogPostPage() {
  const isDesktop = useDesktop()
  const [mounted, setMounted] = useState(false)
  const { t, locale } = useTranslation()
  const params = useParams()

  // Get the blog posts for the current language
  const posts = blogPosts[locale as keyof typeof blogPosts] || blogPosts.en

  // Find the current post using the id from params
  const post = posts.find((post) => post.id === params.id)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Show mobile app on mobile devices
  if (!isDesktop) {
    return <MobileApp />
  }

  // Handle case when post is not found
  if (!post) {
    return (
      <DesktopLayout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{locale === "ro" ? "Articol negăsit" : "Post Not Found"}</h1>
            <p className="mb-8">
              {locale === "ro"
                ? "Ne pare rău, articolul pe care îl cauți nu există sau a fost mutat."
                : "Sorry, the post you are looking for does not exist or has been moved."}
            </p>
            <Button asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {locale === "ro" ? "Înapoi la blog" : "Back to Blog"}
              </Link>
            </Button>
          </div>
        </div>
      </DesktopLayout>
    )
  }

  return (
    <DesktopLayout>
      <article className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button variant="ghost" asChild>
              <Link
                href="/blog"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {locale === "ro" ? "Înapoi la blog" : "Back to Blog"}
              </Link>
            </Button>
          </motion.div>

          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-8">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                >
                  {post.category}
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Author info */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center">
                <img
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{post.author.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{post.author.bio}</p>
                </div>
              </div>
              <SocialShare url={`${typeof window !== "undefined" ? window.location.href : ""}`} title={post.title} />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            <div className="lg:col-span-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }} />
              </div>

              {/* Tags */}
              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                  {locale === "ro" ? "Etichete" : "Tags"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                    {locale === "ro" ? "Articole similare" : "Similar Posts"}
                  </h3>
                  <div className="space-y-4">
                    {posts
                      .filter((p) => p.id !== post.id && p.category === post.category)
                      .slice(0, 3)
                      .map((relatedPost) => (
                        <Link
                          href={`/blog/${relatedPost.id}`}
                          key={relatedPost.id}
                          className="flex items-start gap-3 group"
                        >
                          <img
                            src={relatedPost.image || "/placeholder.svg"}
                            alt={relatedPost.title}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                              {relatedPost.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{relatedPost.date}</p>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                    {locale === "ro" ? "Categorii populare" : "Popular Categories"}
                  </h3>
                  <div className="space-y-2">
                    {Array.from(new Set(posts.map((p) => p.category))).map((category) => (
                      <Link
                        href={`/blog?category=${category}`}
                        key={category}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="text-gray-800 dark:text-gray-200">{category}</span>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        >
                          {posts.filter((p) => p.category === category).length}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </article>
    </DesktopLayout>
  )
}

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
  // Convert headers
  const html = markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")

    // Convert paragraphs
    .replace(/^\s*(\n)?(.+)/gim, (m) => (/<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : "<p>" + m + "</p>"))

    // Convert bold and italic
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")

    // Convert lists
    .replace(/^\s*-\s*(.*)/gim, "<ul><li>$1</li></ul>")
    .replace(/<\/ul>\s*<ul>/g, "")

    // Fix extra paragraph tags
    .replace(/<p><\/p>/g, "")
    .replace(/<p><h(\d)>/g, "<h$1>")
    .replace(/<\/h(\d)><\/p>/g, "</h$1>")
    .replace(/<p><ul>/g, "<ul>")
    .replace(/<\/ul><\/p>/g, "</ul>")

  return html
}


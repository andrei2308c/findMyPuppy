"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { blogPosts } from "@/lib/data/blog-posts"
import { useTranslation } from "@/lib/i18n/client"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  category: string
  author: {
    name: string
    avatar: string
  }
}

export default function BlogPreviewSection() {
  const { t, locale } = useTranslation()

  // Use the localized blog posts, limited to 3 most recent
  const localizedPosts = blogPosts[locale as keyof typeof blogPosts] || blogPosts.en
  const recentPosts = localizedPosts.slice(0, 3)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Latest from Our Blog
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Tips, stories, and resources to help you find or protect your pet.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Button variant="outline" asChild>
              <Link href="/blog">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {recentPosts.map((post) => (
            <motion.div key={post.id} variants={item} className="group">
              <Link href={`/blog/${post.id}`} className="block">
                <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg">
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
        </motion.div>
      </div>
    </section>
  )
}


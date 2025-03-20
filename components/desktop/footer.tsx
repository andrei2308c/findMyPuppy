"use client"

import Link from "next/link"
import { PawPrint, Facebook, Instagram } from "lucide-react"
import { useTranslation } from "@/lib/i18n/client"

export default function DesktopFooter() {
  const { t } = useTranslation()

  const footerLinks = [
    {
      title: t("footer.quickLinks"),
      links: [
        { name: t("menu.home.tabName"), href: "/" },
        { name: t("menu.about.tabName"), href: "/about" },
        { name: t("menu.contact.tabName"), href: "/contact" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { name: t("footer.privacy"), href: "/privacy" },
        { name: t("footer.terms"), href: "/terms" },
        { name: t("footer.cookies"), href: "/cookies" },
      ],
    },
  ]

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-lg">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                {t("appName")}
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t("footer.description")}</p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/findmypuppy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-orange-500 dark:hover:text-orange-400"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/findmypuppy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-orange-500 dark:hover:text-orange-400"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} {t("appName")}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}


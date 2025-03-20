import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { I18nProvider } from "@/lib/i18n/client"
import { Toaster } from "@/components/ui/toaster"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/components/theme-provider"
import RootWrapper from "@/components/root-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FindMyPuppy - Lost Pet Finder",
  description: "Help find lost pets in your area or report a lost pet",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <I18nProvider>
            <RootWrapper>{children}</RootWrapper>
            <SpeedInsights />
            <Analytics />
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
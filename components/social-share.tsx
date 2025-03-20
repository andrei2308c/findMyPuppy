"use client"

import { Share2, Facebook, Twitter, Linkedin, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { useTranslation } from "@/lib/i18n/client"

interface SocialShareProps {
  url: string
  title: string
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const { locale } = useTranslation()

  const shareText = {
    en: {
      share: "Share",
      facebook: "Share on Facebook",
      twitter: "Share on Twitter",
      linkedin: "Share on LinkedIn",
      copyLink: "Copy Link",
      linkCopied: "Link copied to clipboard!",
    },
    ro: {
      share: "Distribuie",
      facebook: "Distribuie pe Facebook",
      twitter: "Distribuie pe Twitter",
      linkedin: "Distribuie pe LinkedIn",
      copyLink: "Copiază Link",
      linkCopied: "Link copiat în clipboard!",
    },
  }

  const text = shareText[locale as keyof typeof shareText] || shareText.en

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    toast({
      title: text.linkCopied,
      duration: 2000,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          {text.share}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`,
              "_blank",
            )
          }
        >
          <Facebook className="h-4 w-4 mr-2" />
          {text.facebook}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
              "_blank",
            )
          }
        >
          <Twitter className="h-4 w-4 mr-2" />
          {text.twitter}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
          }
        >
          <Linkedin className="h-4 w-4 mr-2" />
          {text.linkedin}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <LinkIcon className="h-4 w-4 mr-2" />
          {text.copyLink}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


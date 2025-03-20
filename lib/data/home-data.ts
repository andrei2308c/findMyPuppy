import { MapPin, Bell, Search, Heart, Clock, Users } from "lucide-react"

export const homeData = {
  en: {
    hero: {
      title: "Reunite Lost Pets With Their Families",
      description:
        "Our community-driven platform helps lost pets find their way back home through the power of technology and compassionate people.",
      buttons: {
        search: "Lost Pets",
        help: "Help Others",
      },
    },
    features: {
      title: "Powerful Features to Find Your Pet",
      description:
        "Our platform combines technology and community to maximize the chances of reuniting pets with their owners.",
      items: [
        {
          icon: MapPin,
          title: "Interactive Map",
          description: "Visualize lost and found pets in your area with our interactive map.",
          color: "from-orange-500 to-red-500",
        },
        {
          icon: Bell,
          title: "Real-time Notifications",
          description: "Get instant alerts when a pet matching your criteria is found nearby.",
          color: "from-pink-500 to-purple-500",
        },
        {
          icon: Search,
          title: "Advanced Search",
          description: "Find pets by location, breed, color, and other characteristics.",
          color: "from-blue-500 to-cyan-500",
        },
        {
          icon: Heart,
          title: "Community Support",
          description: "Connect with a network of pet lovers ready to help find lost pets.",
          color: "from-green-500 to-emerald-500",
        },
        {
          icon: Clock,
          title: "Quick Reporting",
          description: "Report lost or found pets in minutes with our streamlined process.",
          color: "from-amber-500 to-yellow-500",
        },
        {
          icon: Users,
          title: "Success Stories",
          description: "Join thousands of happy pet owners who have been reunited with their pets.",
          color: "from-indigo-500 to-violet-500",
        },
      ],
    },
    stats: {
      items: [
        {
          value: "5280+",
          label: "Pets Found",
        },
        {
          value: "12000+",
          label: "Happy Owners",
        },
        {
          value: "150+",
          label: "Cities Covered",
        },
        {
          value: "98%",
          label: "Success Rate",
        },
      ],
    },
    testimonials: {
      title: "Success Stories",
      description: "Hear from pet owners who have successfully reunited with their beloved companions.",
      items: [
        {
          quote:
            "The real-time notifications feature is a game-changer. I received an alert about a found dog matching my lost pet's description and it was him!",
          author: "David Miller",
          location: "Cluj-Napoca",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
        },
        {
          quote:
            "I was devastated when my dog Max went missing. Thanks to FindMyPuppy, we were reunited within 24 hours! The community support was incredible.",
          author: "Sarah Johnson",
          location: "Bucharest",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
        },
        {
          quote:
            "Found a stray cat and didn't know what to do. Posted on FindMyPuppy and within hours, the owner contacted me. So rewarding to help reunite them!",
          author: "Elena Popescu",
          location: "Timișoara",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1887&auto=format&fit=crop",
        },
      ],
    },
    cta: {
      title: "Ready to Help Reunite Pets with Their Families?",
      description:
        "Join our community today and be part of something meaningful. Whether you've lost a pet or found one, your contribution can make all the difference.",
      button: "Get Started Now",
      mobilePrompt: {
        title: "Use Our Mobile App",
        description: "Please use your phone to access our full app. Scan the QR code below:",
        closeButton: "Close",
      },
    },
  },
  ro: {
    hero: {
      title: "Reunește Animalele Pierdute cu Familiile Lor",
      description:
        "Platforma noastră bazată pe comunitate ajută animalele pierdute să își găsească drumul spre casă prin puterea tehnologiei și a oamenilor plini de compasiune.",
      buttons: {
        search: "Animale Pierdute",
        help: "Ajută Alții",
      },
    },
    features: {
      title: "Funcții Puternice pentru a-ți Găsi Animalul",
      description:
        "Platforma noastră combină tehnologia și comunitatea pentru a maximiza șansele de reunire a animalelor cu stăpânii lor.",
      items: [
        {
          icon: MapPin,
          title: "Hartă Interactivă",
          description: "Vizualizează animalele pierdute și găsite din zona ta cu harta noastră interactivă.",
          color: "from-orange-500 to-red-500",
        },
        {
          icon: Bell,
          title: "Notificări în Timp Real",
          description:
            "Primește alerte instant când un animal care se potrivește criteriilor tale este găsit în apropiere.",
          color: "from-pink-500 to-purple-500",
        },
        {
          icon: Search,
          title: "Căutare Avansată",
          description: "Găsește animale după locație, rasă, culoare și alte caracteristici.",
          color: "from-blue-500 to-cyan-500",
        },
        {
          icon: Heart,
          title: "Suport Comunitar",
          description: "Conectează-te cu o rețea de iubitori de animale gata să ajute la găsirea animalelor pierdute.",
          color: "from-green-500 to-emerald-500",
        },
        {
          icon: Clock,
          title: "Raportare Rapidă",
          description: "Raportează animale pierdute sau găsite în câteva minute cu procesul nostru simplificat.",
          color: "from-amber-500 to-yellow-500",
        },
        {
          icon: Users,
          title: "Povești de Succes",
          description: "Alătură-te miilor de stăpâni fericiți care s-au reunit cu animalele lor.",
          color: "from-indigo-500 to-violet-500",
        },
      ],
    },
    stats: {
      items: [
        {
          value: "5280+",
          label: "Animale Găsite",
        },
        {
          value: "12000+",
          label: "Stăpâni Fericiți",
        },
        {
          value: "150+",
          label: "Orașe Acoperite",
        },
        {
          value: "98%",
          label: "Rată de Succes",
        },
      ],
    },
    testimonials: {
      title: "Povești de Succes",
      description: "Ascultă poveștile stăpânilor care s-au reunit cu succes cu companionii lor iubiți.",
      items: [
        {
          quote:
            "Funcția de notificări în timp real este revoluționară. Am primit o alertă despre un câine găsit care se potrivea cu descrierea animalului meu pierdut și era el!",
          author: "David Miller",
          location: "Cluj-Napoca",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
        },
        {
          quote:
            "Am fost devastată când câinele meu Max a dispărut. Mulțumită FindMyPuppy, ne-am reunit în 24 de ore! Sprijinul comunității a fost incredibil.",
          author: "Sarah Johnson",
          location: "București",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
        },
        {
          quote:
            "Am găsit o pisică rătăcită și nu știam ce să fac. Am postat pe FindMyPuppy și în câteva ore, stăpânul m-a contactat. Este atât de reconfortant să ajuți la reunirea lor!",
          author: "Elena Popescu",
          location: "Timișoara",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1887&auto=format&fit=crop",
        },
      ],
    },
    cta: {
      title: "Gata să Ajuți la Reunirea Animalelor cu Familiile Lor?",
      description:
        "Alătură-te comunității noastre astăzi și fii parte din ceva semnificativ. Fie că ai pierdut un animal sau ai găsit unul, contribuția ta poate face toată diferența.",
      button: "Începe Acum",
      mobilePrompt: {
        title: "Folosește Aplicația Noastră Mobilă",
        description:
          "Te rugăm să folosești telefonul pentru a accesa aplicația completă. Scanează codul QR de mai jos:",
        closeButton: "Închide",
      },
    },
  },
}


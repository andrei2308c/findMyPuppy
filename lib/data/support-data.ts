import { Gift, Coffee, RefreshCcw } from "lucide-react"

export const donationPlansData = {
  en: [
    {
      type: "oneTime",
      title: "One-time Donation",
      description: "Support our mission with a single contribution of any amount.",
      icon: Gift,
      price: "Any amount",
      features: [
        "Help reunite pets with their owners",
        "Support our community initiatives",
        "Receive a thank you email",
      ],
      buttonText: "Donate Now",
      color: "from-orange-500 to-red-500",
    },
    {
      type: "monthly",
      title: "Monthly Supporter",
      description: "Become a regular supporter with a monthly donation.",
      icon: RefreshCcw,
      price: "$10/month",
      features: [
        "All benefits of one-time donation",
        "Monthly impact report",
        "Supporter badge on your profile",
        "Early access to new features",
      ],
      buttonText: "Become a Supporter",
      color: "from-pink-500 to-purple-500",
      highlighted: true,
    },
    {
      type: "coffee",
      title: "Coffee for the Team",
      description: "Buy our team a coffee to keep them energized.",
      icon: Coffee,
      price: "$5",
      features: ["Show appreciation to our team", "Help keep us caffeinated", "Receive a virtual high-five"],
      buttonText: "Buy a Coffee",
      color: "from-amber-500 to-yellow-500",
    },
  ],
  ro: [
    {
      type: "oneTime",
      title: "Donație Unică",
      description: "Sprijină misiunea noastră cu o contribuție unică de orice sumă.",
      icon: Gift,
      price: "Orice sumă",
      features: [
        "Ajută la reunirea animalelor cu stăpânii lor",
        "Sprijină inițiativele noastre comunitare",
        "Primește un email de mulțumire",
      ],
      buttonText: "Donează Acum",
      color: "from-orange-500 to-red-500",
    },
    {
      type: "monthly",
      title: "Susținător Lunar",
      description: "Devino un susținător regulat cu o donație lunară.",
      icon: RefreshCcw,
      price: "$10/lună",
      features: [
        "Toate beneficiile donației unice",
        "Raport lunar de impact",
        "Insignă de susținător pe profilul tău",
        "Acces timpuriu la funcții noi",
      ],
      buttonText: "Devino Susținător",
      color: "from-pink-500 to-purple-500",
      highlighted: true,
    },
    {
      type: "coffee",
      title: "O Cafea pentru Echipă",
      description: "Cumpără o cafea pentru echipa noastră pentru a-i menține energizați.",
      icon: Coffee,
      price: "$5",
      features: [
        "Arată apreciere pentru echipa noastră",
        "Ajută-ne să rămânem cafeiniți",
        "Primește un high-five virtual",
      ],
      buttonText: "Cumpără o Cafea",
      color: "from-amber-500 to-yellow-500",
    },
  ],
}

export const faqData = {
  en: [
    {
      question: "How can I report a lost pet?",
      answer:
        'To report a lost pet, click on the "Add Lost Pet" button on the main map screen. Fill in the details about your pet, including photos, description, and your contact information. The pin will be added to the map, and nearby users will be notified.',
    },
    {
      question: "What should I do if I found a pet?",
      answer:
        'If you found a pet, first check if it has a collar with contact information. If not, click on the "Add Found Pet" button on our map and provide details about the pet you found. Our system will automatically check for matching lost pet reports in the area.',
    },
    {
      question: "How does the notification system work?",
      answer:
        "Our notification system alerts users when a lost or found pet is reported within 5km of their location. If you're in \"lost\" mode, you'll be notified about found pets that might match yours, and vice versa. You can click on the notification to view details and contact the reporter.",
    },
    {
      question: "Is the service completely free?",
      answer:
        "Yes, FindMyPuppy is completely free to use. We rely on donations and support from our community to keep the service running. If you find our platform helpful, consider supporting us through a donation.",
    },
    {
      question: "How can I install the app on my phone?",
      answer:
        'FindMyPuppy is a progressive web app (PWA), which means you don\'t need to download it from an app store. On iOS, open Safari, visit our website, tap the share icon, and select "Add to Home Screen." On Android, open Chrome, tap the menu button, and select "Add to Home Screen."',
    },
    {
      question: "How can I help besides donating?",
      answer:
        "There are many ways to help! You can spread the word about FindMyPuppy, share lost pet posts on social media, volunteer to help search for lost pets in your area, or contribute to our open-source code if you're a developer.",
    },
  ],
  ro: [
    {
      question: "Cum pot raporta un animal pierdut?",
      answer:
        'Pentru a raporta un animal pierdut, apasă pe butonul "Adaugă Animal Pierdut" de pe ecranul principal al hărții. Completează detaliile despre animalul tău, inclusiv fotografii, descriere și informațiile tale de contact. Pinul va fi adăugat pe hartă, iar utilizatorii din apropiere vor fi notificați.',
    },
    {
      question: "Ce ar trebui să fac dacă am găsit un animal?",
      answer:
        'Dacă ai găsit un animal, verifică mai întâi dacă are zgardă cu informații de contact. Dacă nu, apasă pe butonul "Adaugă Animal Găsit" de pe harta noastră și oferă detalii despre animalul găsit. Sistemul nostru va verifica automat rapoartele de animale pierdute din zonă care s-ar putea potrivi.',
    },
    {
      question: "Cum funcționează sistemul de notificări?",
      answer:
        'Sistemul nostru de notificări alertează utilizatorii când un animal pierdut sau găsit este raportat într-o rază de 5km de locația lor. Dacă ești în modul "pierdut", vei fi notificat despre animalele găsite care s-ar putea potrivi cu al tău, și vice versa. Poți apăsa pe notificare pentru a vedea detaliile și a contacta raportorul.',
    },
    {
      question: "Serviciul este complet gratuit?",
      answer:
        "Da, FindMyPuppy este complet gratuit. Ne bazăm pe donații și sprijin din partea comunității noastre pentru a menține serviciul funcțional. Dacă găsești platforma noastră utilă, te rugăm să consideri să ne sprijini printr-o donație.",
    },
    {
      question: "Cum pot instala aplicația pe telefonul meu?",
      answer:
        'FindMyPuppy este o aplicație web progresivă (PWA), ceea ce înseamnă că nu trebuie să o descarci din magazinul de aplicații. Pe iOS, deschide Safari, vizitează site-ul nostru, apasă pe iconița de partajare și selectează "Adaugă la ecranul principal". Pe Android, deschide Chrome, apasă pe butonul de meniu și selectează "Adaugă la ecranul principal".',
    },
    {
      question: "Cum pot ajuta în afară de donații?",
      answer:
        "Există multe modalități de a ajuta! Poți răspândi vestea despre FindMyPuppy, poți distribui postări despre animale pierdute pe rețelele sociale, poți voluntaria pentru a ajuta la căutarea animalelor pierdute în zona ta sau poți contribui la codul nostru open-source dacă ești dezvoltator.",
    },
  ],
}


import type { HomepageContent } from "@/types/cms";

const clients = [
  {
    id: "akulaku",
    name: "Akulaku",
    logo: {
      id: "akulaku-logo",
      src: "/clients/Akulaku.png",
      alt: "Akulaku",
    },
  },
  {
    id: "amar-bank",
    name: "Amar Bank",
    logo: {
      id: "amar-bank-logo",
      src: "/clients/AmarBank.png",
      alt: "Amar Bank",
    },
  },
  {
    id: "bfi",
    name: "BFI",
    logo: {
      id: "bfi-logo",
      src: "/clients/BFI.png",
      alt: "BFI Finance",
    },
  },
  {
    id: "bnc",
    name: "Bank Neo Commerce",
    logo: {
      id: "bnc-logo",
      src: "/clients/BNC.png",
      alt: "Bank Neo Commerce",
    },
  },
  {
    id: "generali",
    name: "Generali",
    logo: {
      id: "generali-logo",
      src: "/clients/Generali.png",
      alt: "Generali",
    },
  },
  {
    id: "manulife",
    name: "Manulife",
    logo: {
      id: "manulife-logo",
      src: "/clients/Manulife.png",
      alt: "Manulife",
    },
  },
  {
    id: "spaylater",
    name: "SPayLater",
    logo: {
      id: "spaylater-logo",
      src: "/clients/SPayLater.png",
      alt: "SPayLater",
    },
  },
  {
    id: "traveloka",
    name: "Traveloka",
    logo: {
      id: "traveloka-logo",
      src: "/clients/traveloka.png",
      alt: "Traveloka",
    },
  },
  {
    id: "julo",
    name: "JULO",
    logo: {
      id: "julo-logo",
      src: "/clients/julo.png",
      alt: "JULO",
    },
  },
  {
    id: "indodana",
    name: "Indodana",
    logo: {
      id: "indodana-logo",
      src: "/clients/indodana.png",
      alt: "Indodana",
    },
  },
];

export async function getHomepageContent(locale: "id" | "en"): Promise<HomepageContent> {
  if (locale === "en") {
    return {
      hero: {
        eyebrow: "Integrated Credit Management",
        title: "Credit management. Built for performance.",
        description:
          "Integrated servicing, recovery, portfolio strategy and collection solutions for financial institutions.",
        primaryCta: {
          label: "Explore Our Solutions",
          href: "/en/solutions",
        },
        secondaryCta: {
          label: "Talk to Our Team",
          href: "/en/contact",
        },
      },
      metrics: [],
      solutions: [],
      clients,
    };
  }

  return {
    hero: {
      eyebrow: "Integrated Credit Management",
      title: "Credit management. Built for performance.",
      description:
        "Solusi terintegrasi untuk servicing, recovery, strategi portofolio, dan collection bagi institusi keuangan.",
      primaryCta: {
        label: "Lihat Solusi Kami",
        href: "/id/solutions",
      },
      secondaryCta: {
        label: "Hubungi Kami",
        href: "/id/contact",
      },
    },
    metrics: [],
    solutions: [],
    clients,
  };
}

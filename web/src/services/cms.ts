import type { HomepageContent } from "@/types/cms";

export async function getHomepageContent(
  locale: "id" | "en",
): Promise<HomepageContent> {
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
  };
}

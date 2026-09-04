export const siteConfig = {
  name: "Greatinco",
  legalName: "Greatinco",
  defaultLocale: "id",
  locales: ["id", "en"] as const,

  positioning: {
    id: "Credit Management & Asset Servicing",
    en: "Credit Management & Asset Servicing",
  },

  navigation: {
    id: [
      { label: "Perusahaan", href: "/id/company" },
      { label: "Solusi", href: "/id/solutions" },
      { label: "Aktivitas", href: "/id/activities" },
      { label: "Karier", href: "/id/careers" },
      { label: "Kontak", href: "/id/contact" },
    ],
    en: [
      { label: "Company", href: "/en/company" },
      { label: "Solutions", href: "/en/solutions" },
      { label: "Activities", href: "/en/activities" },
      { label: "Careers", href: "/en/careers" },
      { label: "Contact", href: "/en/contact" },
    ],
  },
} as const;

export type SiteLocale = (typeof siteConfig.locales)[number];

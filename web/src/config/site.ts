export const siteConfig = {
  name: "Greatinco",
  defaultLocale: "id",
  locales: ["id", "en"] as const,

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

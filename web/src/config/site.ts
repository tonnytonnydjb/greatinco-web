export const siteConfig = {
  name: "Greatinco",
  defaultLocale: "id",
  locales: ["id", "en"] as const,

  navigation: {
    id: [
      {
        label: "Perusahaan",
        href: "/id/company",
        children: [
          { label: "Tentang Greatinco", href: "/id/company" },
          { label: "Tim & Kepemimpinan", href: "/id/company/leadership" },
          { label: "Struktur Organisasi", href: "/id/company/organization" },
          { label: "Tata Kelola & Sertifikasi", href: "/id/company/governance" },
        ],
      },
      {
        label: "Solusi",
        href: "/id/solutions",
        children: [
          {
            label: "Credit Servicing & Recovery",
            href: "/id/solutions/credit-servicing-recovery",
          },
          {
            label: "Desk Collection",
            href: "/id/solutions/desk-collection",
          },
          {
            label: "Field Collection",
            href: "/id/solutions/field-collection",
          },
          {
            label: "Collection Manpower",
            href: "/id/solutions/collection-manpower",
          },
          {
            label: "Portfolio Strategy & Investment",
            href: "/id/solutions/portfolio-strategy-investment",
          },
        ],
      },
      {
        label: "Aktivitas",
        href: "/id/activities",
        children: [
          { label: "Aktivitas Kami", href: "/id/activities" },
          { label: "Galeri", href: "/id/activities/gallery" },
        ],
      },
      {
        label: "Karier",
        href: "/id/careers",
      },
      {
        label: "Kontak",
        href: "/id/contact",
      },
    ],

    en: [
      {
        label: "Company",
        href: "/en/company",
        children: [
          { label: "About Greatinco", href: "/en/company" },
          { label: "Leadership", href: "/en/company/leadership" },
          { label: "Organization", href: "/en/company/organization" },
          { label: "Governance & Certifications", href: "/en/company/governance" },
        ],
      },
      {
        label: "Solutions",
        href: "/en/solutions",
        children: [
          {
            label: "Credit Servicing & Recovery",
            href: "/en/solutions/credit-servicing-recovery",
          },
          {
            label: "Desk Collection",
            href: "/en/solutions/desk-collection",
          },
          {
            label: "Field Collection",
            href: "/en/solutions/field-collection",
          },
          {
            label: "Collection Manpower",
            href: "/en/solutions/collection-manpower",
          },
          {
            label: "Portfolio Strategy & Investment",
            href: "/en/solutions/portfolio-strategy-investment",
          },
        ],
      },
      {
        label: "Activities",
        href: "/en/activities",
        children: [
          { label: "Our Activities", href: "/en/activities" },
          { label: "Gallery", href: "/en/activities/gallery" },
        ],
      },
      {
        label: "Careers",
        href: "/en/careers",
      },
      {
        label: "Contact",
        href: "/en/contact",
      },
    ],
  },
} as const;

export type SiteLocale = (typeof siteConfig.locales)[number];

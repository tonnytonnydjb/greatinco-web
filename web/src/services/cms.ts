import "server-only";

import { directusFetch } from "@/lib/directus";
import type {
  CertificationContent,
  ClientLogo,
  HeroContent,
  HomepageContent,
  HomepageSectionContent,
  SolutionContent,
} from "@/types/cms";

type Locale = "id" | "en";

type DirectusHomepageTranslation = {
  id: number;
  languages_id: number;

  hero_eyebrow: string | null;
  hero_title: string | null;
  hero_description: string | null;
  hero_primary_cta_label: string | null;
  hero_primary_cta_url: string | null;
  hero_secondary_cta_label: string | null;
  hero_secondary_cta_url: string | null;

  capabilities_eyebrow: string | null;
  capabilities_title: string | null;
  capabilities_description: string | null;

  solution_eyebrow: string | null;
  solution_title: string | null;
  solution_description: string | null;

  governance_eyebrow: string | null;
  governance_title: string | null;
  governance_description: string | null;

  activities_eyebrow: string | null;
  activities_title: string | null;
  activities_description: string | null;

  cta_eyebrow: string | null;
  cta_title: string | null;
  cta_description: string | null;
  cta_button_label: string | null;
  cta_button_url: string | null;
};

type DirectusHomepage = {
  id: number;
  show_clients: boolean;
  show_capabilities: boolean;
  show_solutions: boolean;
  show_governance: boolean;
  show_activities: boolean;
  show_final_cta: boolean;
  translations: DirectusHomepageTranslation[];
};

type DirectusClient = {
  id: number;
  name: string;
  logo: string | null;
  website: string | null;
  featured: boolean;
  status: string;
  sort: number | null;
};

type DirectusSolutionTranslation = {
  id: number;
  languages_id: number;
  title: string | null;
  short_description: string | null;
};

type DirectusSolution = {
  id: number;
  slug: string;
  status: string;
  featured: boolean;
  sort: number | null;
  translations: DirectusSolutionTranslation[];
};

type DirectusCertificationTranslation = {
  id: number;
  languages_id: number;
  description: string | null;
};

type DirectusCertification = {
  id: number;
  name: string;
  logo: string | null;
  website: string | null;
  featured: boolean;
  status: string;
  sort: number | null;
  translations: DirectusCertificationTranslation[];
};

const languageIdByLocale: Record<Locale, number> = {
  id: 1,
  en: 2,
};

const localClientLogoFallback: Record<string, string> = {
  Akulaku: "/clients/Akulaku.png",
  "Amar Bank": "/clients/AmarBank.png",
  "BFI Finance": "/clients/BFI.png",
  "Bank Neo Commerce": "/clients/BNC.png",
  Generali: "/clients/Generali.png",
  Manulife: "/clients/Manulife.png",
  SPayLater: "/clients/SPayLater.png",
  Traveloka: "/clients/traveloka.png",
  JULO: "/clients/julo.png",
  Indodana: "/clients/indodana.png",
};

const localCertificationFallback: Record<string, string> = {
  AFPI: "/certifications/afpi.png",
  "ISO 27001": "/certifications/iso-27001.png",
  "ISO 9001": "/certifications/iso-9001.png",
  LSPPI: "/certifications/lsppi.png",
};

function localizedPath(locale: Locale, path: string | null): string | undefined {
  if (!path) {
    return undefined;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  ) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (
    normalized === "/id" ||
    normalized.startsWith("/id/") ||
    normalized === "/en" ||
    normalized.startsWith("/en/")
  ) {
    return normalized;
  }

  return `/${locale}${normalized}`;
}

function requireHomepageTranslation(
  homepage: DirectusHomepage,
  locale: Locale,
): DirectusHomepageTranslation {
  const languageId = languageIdByLocale[locale];

  const translation = homepage.translations.find((item) => item.languages_id === languageId);

  if (!translation) {
    throw new Error(`Homepage translation tidak ditemukan untuk locale ${locale}`);
  }

  return translation;
}

function mapHero(locale: Locale, translation: DirectusHomepageTranslation): HeroContent {
  return {
    eyebrow: translation.hero_eyebrow ?? "",
    title: translation.hero_title ?? "",
    description: translation.hero_description ?? "",

    primaryCta: translation.hero_primary_cta_label
      ? {
          label: translation.hero_primary_cta_label,
          href: localizedPath(locale, translation.hero_primary_cta_url) ?? `/${locale}/solutions`,
        }
      : undefined,

    secondaryCta: translation.hero_secondary_cta_label
      ? {
          label: translation.hero_secondary_cta_label,
          href: localizedPath(locale, translation.hero_secondary_cta_url) ?? `/${locale}/contact`,
        }
      : undefined,
  };
}

function mapSection(
  eyebrow: string | null,
  title: string | null,
  description: string | null,
): HomepageSectionContent {
  return {
    eyebrow: eyebrow ?? "",
    title: title ?? "",
    description: description ?? "",
  };
}

function mapClient(client: DirectusClient): ClientLogo {
  return {
    name: client.name,
    image: {
      src: localClientLogoFallback[client.name] ?? "/brand/greatinco-logogram.png",
      alt: client.name,
    },
  };
}

function mapSolution(locale: Locale, solution: DirectusSolution): SolutionContent | null {
  const languageId = languageIdByLocale[locale];

  const translation = solution.translations.find((item) => item.languages_id === languageId);

  if (!translation?.title || !translation.short_description) {
    return null;
  }

  return {
    id: solution.id,
    slug: solution.slug,
    title: translation.title,
    description: translation.short_description,
    href: `/${locale}/solutions/${solution.slug}`,
  };
}

function mapCertification(
  locale: Locale,
  certification: DirectusCertification,
): CertificationContent {
  const languageId = languageIdByLocale[locale];

  const translation = certification.translations.find((item) => item.languages_id === languageId);

  return {
    id: certification.id,
    name: certification.name,
    description: translation?.description ?? "",
    image: {
      src: localCertificationFallback[certification.name] ?? "/brand/greatinco-logogram.png",
      alt: certification.name,
    },
    website: certification.website ?? undefined,
  };
}

export async function getHomepageContent(locale: Locale): Promise<HomepageContent> {
  const [homepage, clients, solutions, certifications] = await Promise.all([
    directusFetch<DirectusHomepage>("/items/homepage?fields=*,translations.*"),

    directusFetch<DirectusClient[]>(
      "/items/clients?fields=id,name,logo,website,featured,status,sort&filter[status][_eq]=published&filter[featured][_eq]=true&sort=sort",
    ),

    directusFetch<DirectusSolution[]>(
      "/items/solutions?fields=id,slug,status,featured,sort,translations.*&filter[status][_eq]=published&filter[featured][_eq]=true&sort=sort",
    ),

    directusFetch<DirectusCertification[]>(
      "/items/certifications?fields=id,name,logo,website,featured,status,sort,translations.*&filter[status][_eq]=published&filter[featured][_eq]=true&sort=sort",
    ),
  ]);

  const translation = requireHomepageTranslation(homepage, locale);

  return {
    hero: mapHero(locale, translation),

    clients: homepage.show_clients ? clients.map(mapClient) : [],

    capabilities: mapSection(
      translation.capabilities_eyebrow,
      translation.capabilities_title,
      translation.capabilities_description,
    ),

    solutionsSection: mapSection(
      translation.solution_eyebrow,
      translation.solution_title,
      translation.solution_description,
    ),

    solutions: homepage.show_solutions
      ? solutions
          .map((solution) => mapSolution(locale, solution))
          .filter((solution): solution is SolutionContent => solution !== null)
      : [],

    governance: mapSection(
      translation.governance_eyebrow,
      translation.governance_title,
      translation.governance_description,
    ),

    certifications: homepage.show_governance
      ? certifications.map((item) => mapCertification(locale, item))
      : [],

    activities: mapSection(
      translation.activities_eyebrow,
      translation.activities_title,
      translation.activities_description,
    ),

    finalCta: {
      eyebrow: translation.cta_eyebrow ?? "",
      title: translation.cta_title ?? "",
      description: translation.cta_description ?? "",
      buttonLabel: translation.cta_button_label ?? "",
      buttonHref: localizedPath(locale, translation.cta_button_url) ?? `/${locale}/contact`,
    },

    metrics: [],
  };
}

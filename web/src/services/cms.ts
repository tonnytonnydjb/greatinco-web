import "server-only";

import { directusAssetUrl, directusFetch } from "@/lib/directus";

import type {
  ActivityContent,
  CertificationContent,
  ClientLogo,
  HeroContent,
  HomepageContent,
  HomepageSectionContent,
  NavigationItem,
  SiteChromeContent,
  SiteLocale,
  SiteSettingsContent,
  SolutionContent,
} from "@/types/cms";

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

type DirectusActivityTranslation = {
  id: number;
  languages_id: number;
  title: string | null;
  category: string | null;
  summary: string | null;
};

type DirectusActivity = {
  id: number;
  slug: string;
  cover_image: string | null;
  activity_date: string;
  featured: boolean;
  status: string;
  sort: number | null;
  translations: DirectusActivityTranslation[];
};

type DirectusNavigationTranslation = {
  id: number;
  languages_id: number;
  label: string | null;
};

type DirectusNavigationParent =
  | number
  | {
      id: number;
    }
  | null;

type DirectusNavigation = {
  id: number;
  location: string;
  url: string | null;
  parent: DirectusNavigationParent;
  open_in_new_tab: boolean | null;
  is_external: boolean | null;
  status: string;
  sort: number | null;
  translations: DirectusNavigationTranslation[];
};

type DirectusSiteSettingsTranslation = {
  id: number;
  languages_id: number;
  footer_description?: string | null;
};

type DirectusSiteSettings = {
  id: number;

  site_name?: string | null;
  legal_name?: string | null;

  logo_light?: string | null;

  contact_email?: string | null;
  phone?: string | null;
  whatsapp_number?: string | null;

  office_address?: string | null;
  office_maps_url?: string | null;

  instagram_url?: string | null;
  linkedin_url?: string | null;
  youtube_url?: string | null;
  tiktok_url?: string | null;

  translations?: DirectusSiteSettingsTranslation[];
};

const languageIdByLocale: Record<SiteLocale, number> = {
  id: 1,
  en: 2,
};

function localizedPath(locale: SiteLocale, path: string | null | undefined): string {
  if (!path) {
    return `/${locale}`;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:") ||
    path.startsWith("#")
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
  locale: SiteLocale,
): DirectusHomepageTranslation {
  const translation = homepage.translations.find(
    (item) => item.languages_id === languageIdByLocale[locale],
  );

  if (!translation) {
    throw new Error(`Homepage translation tidak ditemukan untuk locale ${locale}`);
  }

  return translation;
}

function mapHero(locale: SiteLocale, translation: DirectusHomepageTranslation): HeroContent {
  return {
    eyebrow: translation.hero_eyebrow ?? "",
    title: translation.hero_title ?? "",
    description: translation.hero_description ?? "",

    primaryCta: translation.hero_primary_cta_label
      ? {
          label: translation.hero_primary_cta_label,
          href: localizedPath(locale, translation.hero_primary_cta_url ?? "/solutions"),
        }
      : undefined,

    secondaryCta: translation.hero_secondary_cta_label
      ? {
          label: translation.hero_secondary_cta_label,
          href: localizedPath(locale, translation.hero_secondary_cta_url ?? "/contact"),
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
      src: directusAssetUrl(client.logo) ?? "/brand/greatinco-logogram.png",
      alt: client.name,
    },
  };
}

function mapSolution(locale: SiteLocale, solution: DirectusSolution): SolutionContent | null {
  const translation = solution.translations.find(
    (item) => item.languages_id === languageIdByLocale[locale],
  );

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
  locale: SiteLocale,
  certification: DirectusCertification,
): CertificationContent {
  const translation = certification.translations.find(
    (item) => item.languages_id === languageIdByLocale[locale],
  );

  return {
    id: certification.id,
    name: certification.name,
    description: translation?.description ?? "",
    image: {
      src: directusAssetUrl(certification.logo) ?? "/brand/greatinco-logogram.png",
      alt: certification.name,
    },
    website: certification.website ?? undefined,
  };
}

function mapActivity(locale: SiteLocale, activity: DirectusActivity): ActivityContent | null {
  const translation = activity.translations.find(
    (item) => item.languages_id === languageIdByLocale[locale],
  );

  if (!translation?.title) {
    return null;
  }

  return {
    id: activity.id,
    slug: activity.slug,
    title: translation.title,
    category: translation.category ?? "",
    summary: translation.summary ?? "",
    activityDate: activity.activity_date,
    href: `/${locale}/activities/${activity.slug}`,
    image: {
      src: directusAssetUrl(activity.cover_image) ?? "/brand/greatinco-logogram.png",
      alt: translation.title,
    },
    gallery: [],
  };
}

function getParentId(parent: DirectusNavigationParent): number | null {
  if (parent === null) {
    return null;
  }

  if (typeof parent === "number") {
    return parent;
  }

  return parent.id;
}

function mapNavigation(locale: SiteLocale, items: DirectusNavigation[]): NavigationItem[] {
  const languageId = languageIdByLocale[locale];

  const mapped = new Map<
    number,
    NavigationItem & {
      parentId: number | null;
      sort: number;
    }
  >();

  for (const item of items) {
    const translation = item.translations.find((entry) => entry.languages_id === languageId);

    if (!translation?.label) {
      continue;
    }

    mapped.set(item.id, {
      id: item.id,
      label: translation.label,
      href: localizedPath(locale, item.url),
      isExternal: Boolean(item.is_external),
      openInNewTab: Boolean(item.open_in_new_tab),
      children: [],
      parentId: getParentId(item.parent),
      sort: item.sort ?? 999,
    });
  }

  const roots: Array<
    NavigationItem & {
      parentId: number | null;
      sort: number;
    }
  > = [];

  for (const item of mapped.values()) {
    if (item.parentId !== null && mapped.has(item.parentId)) {
      mapped.get(item.parentId)?.children.push(item);
    } else {
      roots.push(item);
    }
  }

  function sortTree(itemsToSort: NavigationItem[]) {
    itemsToSort.sort((a, b) => {
      const aInternal = mapped.get(a.id);
      const bInternal = mapped.get(b.id);

      return (aInternal?.sort ?? 999) - (bInternal?.sort ?? 999);
    });

    for (const item of itemsToSort) {
      sortTree(item.children);
    }
  }

  sortTree(roots);

  return roots.map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    isExternal: item.isExternal,
    openInNewTab: item.openInNewTab,
    children: item.children,
  }));
}

function mapSiteSettings(locale: SiteLocale, settings: DirectusSiteSettings): SiteSettingsContent {
  const translation = settings.translations?.find(
    (item) => item.languages_id === languageIdByLocale[locale],
  );

  return {
    siteName: settings.site_name ?? "Greatinco",

    legalName: settings.legal_name ?? "PT Greatinco Capital Indonesia",

    footerDescription:
      translation?.footer_description ??
      (locale === "id"
        ? "Solusi manajemen kredit, penagihan, pemulihan, dan pengelolaan portofolio bagi institusi keuangan."
        : "Credit management, collection, recovery and portfolio solutions for financial institutions."),

    logoLight: {
      src: directusAssetUrl(settings.logo_light) ?? "/brand/greatinco-logo-white.png",
      alt: settings.site_name ?? "Greatinco",
    },

    contactEmail: settings.contact_email ?? undefined,

    phone: settings.phone ?? undefined,

    whatsapp: settings.whatsapp_number ?? undefined,

    officeAddress: settings.office_address ?? undefined,

    officeMapsUrl: settings.office_maps_url ?? undefined,

    instagramUrl: settings.instagram_url ?? undefined,

    youtubeUrl: settings.youtube_url ?? undefined,

    tiktokUrl: settings.tiktok_url ?? undefined,
  };
}

export async function getSiteChromeContent(locale: SiteLocale): Promise<SiteChromeContent> {
  const [navigation, settings] = await Promise.all([
    directusFetch<DirectusNavigation[]>(
      "/items/navigation?fields=id,location,url,parent,open_in_new_tab,is_external,status,sort,translations.*&filter[status][_eq]=published&sort=sort&limit=-1",
    ),

    directusFetch<DirectusSiteSettings>("/items/site_settings?fields=*,translations.*"),
  ]);

  return {
    headerNavigation: mapNavigation(
      locale,
      navigation.filter((item) => item.location === "header"),
    ),

    footerNavigation: mapNavigation(
      locale,
      navigation.filter((item) => item.location === "footer"),
    ),

    settings: mapSiteSettings(locale, settings),
  };
}

export async function getHomepageContent(locale: SiteLocale): Promise<HomepageContent> {
  const [homepage, clients, solutions, certifications, activities] = await Promise.all([
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

    directusFetch<DirectusActivity[]>(
      "/items/activities?fields=id,slug,cover_image,activity_date,featured,status,sort,translations.*&filter[status][_eq]=published&filter[featured][_eq]=true&sort=sort&limit=3",
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
          .map((item) => mapSolution(locale, item))
          .filter((item): item is SolutionContent => item !== null)
      : [],

    governance: mapSection(
      translation.governance_eyebrow,
      translation.governance_title,
      translation.governance_description,
    ),

    certifications: homepage.show_governance
      ? certifications.map((item) => mapCertification(locale, item))
      : [],

    activitiesSection: mapSection(
      translation.activities_eyebrow,
      translation.activities_title,
      translation.activities_description,
    ),

    activities: homepage.show_activities
      ? activities
          .map((item) => mapActivity(locale, item))
          .filter((item): item is ActivityContent => item !== null)
      : [],

    finalCta: {
      eyebrow: translation.cta_eyebrow ?? "",
      title: translation.cta_title ?? "",
      description: translation.cta_description ?? "",
      buttonLabel: translation.cta_button_label ?? "",
      buttonHref: localizedPath(locale, translation.cta_button_url ?? "/contact"),
    },

    metrics: [],
  };
}

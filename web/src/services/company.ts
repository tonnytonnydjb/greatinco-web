import "server-only";

import { directusAssetUrl, directusFetch } from "@/lib/directus";
import type { SiteLocale } from "@/types/cms";

export type CompanyPageContent = {
  id: number;
  slug: string;
  sort: number;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  intro: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  heroImage?: {
    src: string;
    alt: string;
  };
};

type DirectusCompanyTranslation = {
  id: number;
  languages_id: number;
  eyebrow: string | null;
  hero_title: string | null;
  hero_description: string | null;
  intro: string | null;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

type DirectusCompanyPage = {
  id: number;
  slug: string;
  status: string;
  sort: number | null;
  hero_image: string | null;
  translations: DirectusCompanyTranslation[];
};

const LANGUAGE_IDS: Record<SiteLocale, number> = {
  id: 1,
  en: 2,
};

function mapCompanyPage(locale: SiteLocale, page: DirectusCompanyPage): CompanyPageContent | null {
  const translation = page.translations.find((item) => item.languages_id === LANGUAGE_IDS[locale]);

  if (!translation) {
    return null;
  }

  const fallbackTitle = locale === "id" ? "Greatinco" : "Greatinco";

  return {
    id: page.id,
    slug: page.slug,
    sort: page.sort ?? 0,
    eyebrow: translation.eyebrow ?? "",
    heroTitle: translation.hero_title ?? fallbackTitle,
    heroDescription: translation.hero_description ?? "",
    intro: translation.intro ?? "",
    content: translation.content ?? "",
    seoTitle: translation.seo_title ?? translation.hero_title ?? fallbackTitle,
    seoDescription:
      translation.seo_description ?? translation.hero_description ?? translation.intro ?? "",
    heroImage: page.hero_image
      ? {
          src: directusAssetUrl(page.hero_image) ?? "",
          alt: translation.hero_title ?? fallbackTitle,
        }
      : undefined,
  };
}

const COMPANY_FIELDS = [
  "id",
  "slug",
  "status",
  "sort",
  "hero_image",
  "translations.id",
  "translations.languages_id",
  "translations.eyebrow",
  "translations.hero_title",
  "translations.hero_description",
  "translations.intro",
  "translations.content",
  "translations.seo_title",
  "translations.seo_description",
].join(",");

export async function getCompanyPages(locale: SiteLocale): Promise<CompanyPageContent[]> {
  const pages = await directusFetch<DirectusCompanyPage[]>(
    `/items/company_pages?fields=${COMPANY_FIELDS}&filter[status][_eq]=published&sort=sort&limit=-1`,
  );

  return pages
    .map((page) => mapCompanyPage(locale, page))
    .filter((page): page is CompanyPageContent => page !== null);
}

export async function getCompanyPageBySlug(
  locale: SiteLocale,
  slug: string,
): Promise<CompanyPageContent | null> {
  const pages = await directusFetch<DirectusCompanyPage[]>(
    `/items/company_pages?fields=${COMPANY_FIELDS}&filter[status][_eq]=published&filter[slug][_eq]=${encodeURIComponent(
      slug,
    )}&limit=1`,
  );

  const page = pages[0];

  if (!page) {
    return null;
  }

  return mapCompanyPage(locale, page);
}

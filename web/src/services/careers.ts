import "server-only";

import { directusFetch } from "@/lib/directus";
import type { SiteLocale } from "@/types/cms";

type DirectusVacancyTranslation = {
  id: number;
  languages_id: number;

  title: string | null;
  summary: string | null;
  description: string | null;
  requirements: string | null;
  benefits: string | null;

  seo_title: string | null;
  seo_description: string | null;
};

type DirectusVacancy = {
  id: number;
  slug: string;

  department: string | null;
  location: string | null;
  employment_type: string | null;

  published_at: string | null;
  closing_date: string | null;

  status: string;
  sort: number | null;

  translations: DirectusVacancyTranslation[];
};

export type VacancyListItem = {
  id: number;
  slug: string;

  title: string;
  summary: string;

  department: string;
  location: string;
  employmentType: string;

  publishedAt?: string;
  closingDate?: string;

  href: string;
};

export type VacancyDetail = {
  id: number;
  slug: string;

  title: string;
  summary: string;

  department: string;
  location: string;
  employmentType: string;

  publishedAt?: string;
  closingDate?: string;

  description: string[];
  requirements: string[];
  benefits: string[];

  seoTitle: string;
  seoDescription: string;
};

const languageIdByLocale: Record<SiteLocale, number> = {
  id: 1,
  en: 2,
};

function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\r/g, "")
    .trim();
}

function textBlocks(value: string | null): string[] {
  if (!value) {
    return [];
  }

  const clean = stripHtml(value);

  return clean
    .split(/\n{2,}|\n(?=[•\-])/)
    .map((item) => item.replace(/^[•\-]\s*/, "").trim())
    .filter(Boolean);
}

function translationFor(vacancy: DirectusVacancy, locale: SiteLocale) {
  return vacancy.translations.find((item) => item.languages_id === languageIdByLocale[locale]);
}

function mapVacancyListItem(vacancy: DirectusVacancy, locale: SiteLocale): VacancyListItem | null {
  const translation = translationFor(vacancy, locale);

  if (!translation?.title) {
    return null;
  }

  return {
    id: vacancy.id,
    slug: vacancy.slug,

    title: translation.title,
    summary: translation.summary ?? "",

    department: vacancy.department ?? "",
    location: vacancy.location ?? "",
    employmentType: vacancy.employment_type ?? "",

    publishedAt: vacancy.published_at ?? undefined,

    closingDate: vacancy.closing_date ?? undefined,

    href: `/${locale}/careers/${vacancy.slug}`,
  };
}

function mapVacancyDetail(vacancy: DirectusVacancy, locale: SiteLocale): VacancyDetail | null {
  const translation = translationFor(vacancy, locale);

  if (!translation?.title) {
    return null;
  }

  return {
    id: vacancy.id,
    slug: vacancy.slug,

    title: translation.title,
    summary: translation.summary ?? "",

    department: vacancy.department ?? "",
    location: vacancy.location ?? "",
    employmentType: vacancy.employment_type ?? "",

    publishedAt: vacancy.published_at ?? undefined,

    closingDate: vacancy.closing_date ?? undefined,

    description: textBlocks(translation.description),

    requirements: textBlocks(translation.requirements),

    benefits: textBlocks(translation.benefits),

    seoTitle: translation.seo_title || `${translation.title} | Careers at Greatinco`,

    seoDescription: translation.seo_description || translation.summary || "",
  };
}

export async function getVacancies(locale: SiteLocale): Promise<VacancyListItem[]> {
  const rows = await directusFetch<DirectusVacancy[]>(
    "/items/vacancies?fields=id,slug,department,location,employment_type,published_at,closing_date,status,sort,translations.*&filter[status][_eq]=published&sort=sort,-published_at&limit=-1",
  );

  return rows
    .map((row) => mapVacancyListItem(row, locale))
    .filter((row): row is VacancyListItem => row !== null);
}

export async function getVacancyBySlug(
  locale: SiteLocale,
  slug: string,
): Promise<VacancyDetail | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return null;
  }

  const rows = await directusFetch<DirectusVacancy[]>(
    `/items/vacancies?fields=id,slug,department,location,employment_type,published_at,closing_date,status,sort,translations.*&filter[status][_eq]=published&filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`,
  );

  if (!rows[0]) {
    return null;
  }

  return mapVacancyDetail(rows[0], locale);
}

import "server-only";

import { directusFetch } from "@/lib/directus";
import type { SiteLocale } from "@/types/cms";

type DirectusLegalTranslation = {
  id: number;
  languages_id: number;
  title: string | null;
  body: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

type DirectusLegalPage = {
  id: number;
  slug: string;
  status: string;
  sort: number | null;
  translations: DirectusLegalTranslation[];
};

export type LegalPageContent = {
  id: number;
  slug: string;
  title: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
};

const LANGUAGE_IDS: Record<SiteLocale, number> = {
  id: 1,
  en: 2,
};

function sanitizeLegalHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");
}

export async function getLegalPage(
  locale: SiteLocale,
  slug: "privacy" | "terms",
): Promise<LegalPageContent | null> {
  const rows = await directusFetch<DirectusLegalPage[]>(
    `/items/legal_pages?fields=id,slug,status,sort,translations.*&filter[status][_eq]=published&filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`,
  );

  const page = rows[0];

  if (!page) {
    return null;
  }

  const translation = page.translations.find(
    (item) => item.languages_id === LANGUAGE_IDS[locale],
  );

  if (!translation?.title) {
    return null;
  }

  return {
    id: page.id,
    slug: page.slug,
    title: translation.title,
    body: sanitizeLegalHtml(translation.body ?? ""),
    seoTitle: translation.seo_title || `${translation.title} | Greatinco`,
    seoDescription: translation.seo_description || translation.title,
  };
}

import "server-only";

import { directusAssetUrl, directusFetch } from "@/lib/directus";

import type { CmsImage, SiteLocale } from "@/types/cms";

type DirectusSolutionTranslation = {
  id: number;
  languages_id: number;

  title: string | null;
  short_description: string | null;

  hero_title: string | null;
  hero_description: string | null;

  content: unknown;

  seo_title: string | null;
  seo_description: string | null;
};

type DirectusSolution = {
  id: number;
  slug: string;

  status: string;
  sort: number | null;
  featured: boolean | null;

  hero_image: string | null;

  translations: DirectusSolutionTranslation[];
};

export type SolutionListItem = {
  id: number;
  slug: string;
  title: string;
  description: string;
  href: string;
};

export type SolutionDetail = {
  id: number;
  slug: string;

  title: string;
  shortDescription: string;

  heroTitle: string;
  heroDescription: string;

  heroImage?: CmsImage;

  content: string[];

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
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function collectText(value: unknown, result: string[]): void {
  if (typeof value === "string") {
    const clean = stripHtml(value);

    if (clean) {
      result.push(clean);
    }

    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectText(item, result);
    }

    return;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    /*
     * Common Directus / Editor.js fields.
     * We prefer meaningful content fields and
     * deliberately ignore IDs / metadata.
     */
    const preferredKeys = [
      "text",
      "content",
      "items",
      "list",
      "caption",
      "quote",
      "description",
      "title",
    ];

    let matched = false;

    for (const key of preferredKeys) {
      if (key in record) {
        matched = true;
        collectText(record[key], result);
      }
    }

    if (!matched) {
      for (const [key, child] of Object.entries(record)) {
        if (["id", "type", "tunes", "version", "time"].includes(key)) {
          continue;
        }

        collectText(child, result);
      }
    }
  }
}

function normalizeContent(content: unknown): string[] {
  const raw: string[] = [];

  collectText(content, raw);

  const paragraphs = raw
    .flatMap((item) => item.split(/\n{2,}/).map((part) => part.trim()))
    .filter(Boolean);

  return [...new Set(paragraphs)];
}

function translationFor(
  solution: DirectusSolution,
  locale: SiteLocale,
): DirectusSolutionTranslation | undefined {
  return solution.translations.find((item) => item.languages_id === languageIdByLocale[locale]);
}

function mapListItem(solution: DirectusSolution, locale: SiteLocale): SolutionListItem | null {
  const translation = translationFor(solution, locale);

  if (!translation?.title) {
    return null;
  }

  return {
    id: solution.id,
    slug: solution.slug,
    title: translation.title,
    description: translation.short_description ?? "",
    href: `/${locale}/solutions/${solution.slug}`,
  };
}

function mapDetail(solution: DirectusSolution, locale: SiteLocale): SolutionDetail | null {
  const translation = translationFor(solution, locale);

  if (!translation?.title) {
    return null;
  }

  const heroTitle = translation.hero_title || translation.title;

  const heroDescription = translation.hero_description || translation.short_description || "";

  return {
    id: solution.id,
    slug: solution.slug,

    title: translation.title,

    shortDescription: translation.short_description ?? "",

    heroTitle,
    heroDescription,

    heroImage: solution.hero_image
      ? {
          src: directusAssetUrl(solution.hero_image) ?? "",
          alt: heroTitle,
        }
      : undefined,

    content: normalizeContent(translation.content),

    seoTitle: translation.seo_title || `${translation.title} | Greatinco`,

    seoDescription: translation.seo_description || translation.short_description || heroDescription,
  };
}

export async function getAllSolutions(locale: SiteLocale): Promise<SolutionListItem[]> {
  const solutions = await directusFetch<DirectusSolution[]>(
    "/items/solutions?fields=id,slug,status,sort,featured,hero_image,translations.*&filter[status][_eq]=published&sort=sort&limit=-1",
  );

  return solutions
    .map((solution) => mapListItem(solution, locale))
    .filter((solution): solution is SolutionListItem => solution !== null);
}

export async function getSolutionBySlug(
  locale: SiteLocale,
  slug: string,
): Promise<SolutionDetail | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return null;
  }

  const encoded = encodeURIComponent(slug);

  const solutions = await directusFetch<DirectusSolution[]>(
    `/items/solutions?fields=id,slug,status,sort,featured,hero_image,translations.*&filter[status][_eq]=published&filter[slug][_eq]=${encoded}&limit=1`,
  );

  const solution = solutions[0];

  if (!solution) {
    return null;
  }

  return mapDetail(solution, locale);
}

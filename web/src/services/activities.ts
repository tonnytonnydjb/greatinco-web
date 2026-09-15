import "server-only";

import { directusAssetUrl, directusFetch } from "@/lib/directus";
import type { ActivityContent, SiteLocale } from "@/types/cms";

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

const languageIdByLocale: Record<SiteLocale, number> = {
  id: 1,
  en: 2,
};

function mapActivity(
  locale: SiteLocale,
  activity: DirectusActivity,
): ActivityContent | null {
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
  };
}

export async function getActivities(
  locale: SiteLocale,
): Promise<ActivityContent[]> {
  const rows = await directusFetch<DirectusActivity[]>(
    "/items/activities?fields=id,slug,cover_image,activity_date,featured,status,sort,translations.*&filter[status][_eq]=published&sort=sort,-activity_date&limit=-1",
  );

  return rows
    .map((row) => mapActivity(locale, row))
    .filter((row): row is ActivityContent => row !== null);
}

export async function getActivityBySlug(
  locale: SiteLocale,
  slug: string,
): Promise<ActivityContent | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return null;
  }

  const rows = await directusFetch<DirectusActivity[]>(
    `/items/activities?fields=id,slug,cover_image,activity_date,featured,status,sort,translations.*&filter[status][_eq]=published&filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`,
  );

  if (!rows[0]) {
    return null;
  }

  return mapActivity(locale, rows[0]);
}

import "server-only";

import { directusAssetUrl, directusFetch } from "@/lib/directus";
import type { ActivityContent, CmsImage, SiteLocale } from "@/types/cms";

type DirectusActivityTranslation = {
  id: number;
  languages_id: number;
  title: string | null;
  category: string | null;
  summary: string | null;
};

type DirectusGalleryItem = {
  id: number;
  sort: number | null;
  directus_files_id: string | { id: string } | null;
};

type DirectusActivity = {
  id: number;
  slug: string;
  cover_image: string | null;
  activity_date: string;
  featured: boolean;
  status: string;
  sort: number | null;
  gallery: DirectusGalleryItem[];
  translations: DirectusActivityTranslation[];
};

const languageIdByLocale: Record<SiteLocale, number> = {
  id: 1,
  en: 2,
};

function galleryFileId(
  value: DirectusGalleryItem["directus_files_id"],
): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  return value.id ?? null;
}

function mapGallery(
  activity: DirectusActivity,
  title: string,
): CmsImage[] {
  const coverId = activity.cover_image;

  const items = [...(activity.gallery ?? [])].sort((a, b) => {
    const aSort = a.sort ?? Number.MAX_SAFE_INTEGER;
    const bSort = b.sort ?? Number.MAX_SAFE_INTEGER;

    if (aSort !== bSort) {
      return aSort - bSort;
    }

    return a.id - b.id;
  });

  const seen = new Set<string>();

  return items.flatMap((item, index) => {
    const fileId = galleryFileId(item.directus_files_id);

    if (!fileId || fileId === coverId || seen.has(fileId)) {
      return [];
    }

    const src = directusAssetUrl(fileId);

    if (!src) {
      return [];
    }

    seen.add(fileId);

    return [
      {
        src,
        alt: `${title} - ${index + 1}`,
      },
    ];
  });
}

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
      src:
        directusAssetUrl(activity.cover_image) ??
        "/brand/greatinco-logogram.png",
      alt: translation.title,
    },
    gallery: mapGallery(activity, translation.title),
  };
}

const activityFields = [
  "id",
  "slug",
  "cover_image",
  "activity_date",
  "featured",
  "status",
  "sort",
  "gallery.id",
  "gallery.sort",
  "gallery.directus_files_id",
  "translations.*",
].join(",");

export async function getActivities(
  locale: SiteLocale,
): Promise<ActivityContent[]> {
  const rows = await directusFetch<DirectusActivity[]>(
    `/items/activities?fields=${activityFields}&filter[status][_eq]=published&sort=sort,-activity_date&limit=-1`,
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
    `/items/activities?fields=${activityFields}&filter[status][_eq]=published&filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`,
  );

  if (!rows[0]) {
    return null;
  }

  return mapActivity(locale, rows[0]);
}

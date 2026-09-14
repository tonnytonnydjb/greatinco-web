import "server-only";

import { directusAssetUrl, directusFetch } from "@/lib/directus";
import type { SiteLocale } from "@/types/cms";

export type LeadershipMember = {
  id: number;
  name: string;
  position: string;
  biography: string;
  photo?: {
    src: string;
    alt: string;
  };
  linkedinUrl?: string;
};

type DirectusLeadershipTranslation = {
  id: number;
  languages_id: number;
  position: string | null;
  biography: string | null;
};

type DirectusLeadership = {
  id: number;
  name: string;
  photo: string | null;
  linkedin_url: string | null;
  featured: boolean;
  status: string;
  sort: number | null;
  translations: DirectusLeadershipTranslation[];
};

const LANGUAGE_IDS: Record<SiteLocale, number> = {
  id: 1,
  en: 2,
};

function htmlToText(value: string | null): string {
  if (!value) {
    return "";
  }

  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function getLeadershipMembers(locale: SiteLocale): Promise<LeadershipMember[]> {
  const items = await directusFetch<DirectusLeadership[]>(
    "/items/leadership?fields=id,name,photo,linkedin_url,featured,status,sort,translations.*&filter[status][_eq]=published&sort=sort&limit=-1",
  );

  return items.flatMap((item): LeadershipMember[] => {
    const translation = item.translations.find(
      (entry) => entry.languages_id === LANGUAGE_IDS[locale],
    );

    if (!translation) {
      return [];
    }

    const member: LeadershipMember = {
      id: item.id,
      name: item.name,
      position: translation.position ?? "",
      biography: htmlToText(translation.biography),
    };

    if (item.photo) {
      const src = directusAssetUrl(item.photo);

      if (src) {
        member.photo = {
          src,
          alt: item.name,
        };
      }
    }

    if (item.linkedin_url) {
      member.linkedinUrl = item.linkedin_url;
    }

    return [member];
  });
}

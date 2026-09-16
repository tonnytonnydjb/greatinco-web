import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ActivityDetailPage } from "@/components/activities/ActivityDetailPage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getActivityBySlug } from "@/services/activities";
import { getSiteChromeContent } from "@/services/cms";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getActivityBySlug("id", slug);

  if (!activity) {
    return {
      title: "Aktivitas | Greatinco",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${activity.title} | Greatinco`,
    description: activity.summary,
  };
}

export default async function IndonesianActivityDetail({ params }: Props) {
  const { slug } = await params;

  const [activity, chrome] = await Promise.all([
    getActivityBySlug("id", slug),
    getSiteChromeContent("id"),
  ]);

  if (!activity) {
    notFound();
  }

  return (
    <>
      <SiteHeader
        locale="id"
        navigation={chrome.headerNavigation}
        settings={chrome.settings}
      />
      <ActivityDetailPage locale="id" activity={activity} />
      <SiteFooter
        locale="id"
        navigation={chrome.footerNavigation}
        settings={chrome.settings}
      />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ActivityDetailPage } from "@/components/activities/ActivityDetailPage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getActivityBySlug } from "@/services/activities";
import { getSiteChromeContent } from "@/services/cms";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getActivityBySlug("en", slug);

  if (!activity) {
    return {
      title: "Activity Not Found | Greatinco",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${activity.title} | Greatinco`,
    description: activity.summary || activity.title,
  };
}

export default async function EnglishActivityDetailPage({ params }: Props) {
  const { slug } = await params;

  const [activity, chrome] = await Promise.all([
    getActivityBySlug("en", slug),
    getSiteChromeContent("en"),
  ]);

  if (!activity) {
    notFound();
  }

  return (
    <>
      <SiteHeader locale="en" navigation={chrome.headerNavigation} settings={chrome.settings} />
      <ActivityDetailPage locale="en" activity={activity} />
      <SiteFooter locale="en" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

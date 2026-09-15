import type { Metadata } from "next";

import { ActivityGallery } from "@/components/activities/ActivityGallery";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getActivities } from "@/services/activities";
import { getSiteChromeContent } from "@/services/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Activity Gallery | Greatinco",
  description: "Explore Greatinco activity documentation and company events.",
};

export default async function EnglishActivityGalleryPage() {
  const [activities, chrome] = await Promise.all([
    getActivities("en"),
    getSiteChromeContent("en"),
  ]);

  return (
    <>
      <SiteHeader locale="en" navigation={chrome.headerNavigation} settings={chrome.settings} />
      <ActivityGallery locale="en" activities={activities} />
      <SiteFooter locale="en" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

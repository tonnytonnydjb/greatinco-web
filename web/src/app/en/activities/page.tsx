import type { Metadata } from "next";

import { ActivitiesIndex } from "@/components/activities/ActivitiesIndex";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getActivities } from "@/services/activities";
import { getSiteChromeContent } from "@/services/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Activities | Greatinco",
  description:
    "Explore Greatinco company activities, people development, events and initiatives.",
};

export default async function EnglishActivitiesPage() {
  const [activities, chrome] = await Promise.all([
    getActivities("en"),
    getSiteChromeContent("en"),
  ]);

  return (
    <>
      <SiteHeader locale="en" navigation={chrome.headerNavigation} settings={chrome.settings} />
      <ActivitiesIndex locale="en" activities={activities} />
      <SiteFooter locale="en" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

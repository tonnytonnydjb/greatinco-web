import type { Metadata } from "next";

import { ActivitiesIndex } from "@/components/activities/ActivitiesIndex";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getActivities } from "@/services/activities";
import { getSiteChromeContent } from "@/services/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aktivitas | Greatinco",
  description:
    "Ikuti kegiatan perusahaan, pengembangan tim, acara, dan berbagai inisiatif Greatinco.",
};

export default async function IndonesianActivitiesPage() {
  const [activities, chrome] = await Promise.all([
    getActivities("id"),
    getSiteChromeContent("id"),
  ]);

  return (
    <>
      <SiteHeader locale="id" navigation={chrome.headerNavigation} settings={chrome.settings} />
      <ActivitiesIndex locale="id" activities={activities} />
      <SiteFooter locale="id" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

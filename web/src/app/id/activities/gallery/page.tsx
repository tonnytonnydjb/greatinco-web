import type { Metadata } from "next";

import { ActivityGallery } from "@/components/activities/ActivityGallery";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getActivities } from "@/services/activities";
import { getSiteChromeContent } from "@/services/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeri Aktivitas | Greatinco",
  description: "Dokumentasi kegiatan dan acara Greatinco.",
};

export default async function IndonesianActivityGalleryPage() {
  const [activities, chrome] = await Promise.all([
    getActivities("id"),
    getSiteChromeContent("id"),
  ]);

  return (
    <>
      <SiteHeader locale="id" navigation={chrome.headerNavigation} settings={chrome.settings} />
      <ActivityGallery locale="id" activities={activities} />
      <SiteFooter locale="id" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

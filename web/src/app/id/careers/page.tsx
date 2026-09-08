import type { Metadata } from "next";

import { CareersIndex } from "@/components/careers/CareersIndex";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

import { getVacancies } from "@/services/careers";
import { getSiteChromeContent } from "@/services/cms";

export const metadata: Metadata = {
  title: "Karier | Greatinco",
  description:
    "Temukan peluang karier di Greatinco dan berkembang bersama tim yang berfokus pada credit management, collection, technology, dan financial services.",
};

export default async function IndonesianCareersPage() {
  const [vacancies, chrome] = await Promise.all([getVacancies("id"), getSiteChromeContent("id")]);

  return (
    <>
      <SiteHeader locale="id" navigation={chrome.headerNavigation} settings={chrome.settings} />

      <CareersIndex locale="id" vacancies={vacancies} />

      <SiteFooter locale="id" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

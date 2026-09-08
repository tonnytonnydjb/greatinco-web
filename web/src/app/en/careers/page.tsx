import type { Metadata } from "next";

import { CareersIndex } from "@/components/careers/CareersIndex";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

import { getVacancies } from "@/services/careers";
import { getSiteChromeContent } from "@/services/cms";

export const metadata: Metadata = {
  title: "Careers | Greatinco",
  description:
    "Explore career opportunities at Greatinco across credit management, collection, technology and financial services.",
};

export default async function EnglishCareersPage() {
  const [vacancies, chrome] = await Promise.all([getVacancies("en"), getSiteChromeContent("en")]);

  return (
    <>
      <SiteHeader locale="en" navigation={chrome.headerNavigation} settings={chrome.settings} />

      <CareersIndex locale="en" vacancies={vacancies} />

      <SiteFooter locale="en" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

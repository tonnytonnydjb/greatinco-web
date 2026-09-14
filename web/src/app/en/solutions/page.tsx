import type { Metadata } from "next";

import { SolutionsIndex } from "@/components/solutions/SolutionsIndex";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

import { getSiteChromeContent } from "@/services/cms";

import { getAllSolutions } from "@/services/solutions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Credit Management Solutions | Greatinco",
  description:
    "Greatinco solutions for credit servicing, desk collection, field collection, collection manpower and portfolio strategy.",
};

export default async function EnglishSolutionsPage() {
  const [solutions, chrome] = await Promise.all([
    getAllSolutions("en"),
    getSiteChromeContent("en"),
  ]);

  return (
    <>
      <SiteHeader locale="en" navigation={chrome.headerNavigation} settings={chrome.settings} />

      <SolutionsIndex locale="en" solutions={solutions} />

      <SiteFooter locale="en" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

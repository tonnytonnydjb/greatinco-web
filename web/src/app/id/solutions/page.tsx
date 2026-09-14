import type { Metadata } from "next";

import { SolutionsIndex } from "@/components/solutions/SolutionsIndex";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

import { getSiteChromeContent } from "@/services/cms";

import { getAllSolutions } from "@/services/solutions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Solusi Manajemen Kredit | Greatinco",
  description:
    "Solusi Greatinco untuk credit servicing, desk collection, field collection, manpower collection, dan strategi portofolio.",
};

export default async function IndonesianSolutionsPage() {
  const [solutions, chrome] = await Promise.all([
    getAllSolutions("id"),
    getSiteChromeContent("id"),
  ]);

  return (
    <>
      <SiteHeader locale="id" navigation={chrome.headerNavigation} settings={chrome.settings} />

      <SolutionsIndex locale="id" solutions={solutions} />

      <SiteFooter locale="id" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

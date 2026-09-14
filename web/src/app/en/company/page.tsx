import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CompanyPage } from "@/components/company/CompanyPage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getCompanyPageBySlug, getCompanyPages } from "@/services/company";
import { getSiteChromeContent } from "@/services/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCompanyPageBySlug("en", "company");

  if (!page) {
    return {
      title: "Company | Greatinco",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: page.seoTitle,
    description: page.seoDescription,
  };
}

export default async function EnglishCompanyPage() {
  const [page, pages, chrome] = await Promise.all([
    getCompanyPageBySlug("en", "company"),
    getCompanyPages("en"),
    getSiteChromeContent("en"),
  ]);

  if (!page) {
    notFound();
  }

  return (
    <>
      <SiteHeader locale="en" navigation={chrome.headerNavigation} settings={chrome.settings} />

      <CompanyPage locale="en" page={page} pages={pages} />

      <SiteFooter locale="en" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

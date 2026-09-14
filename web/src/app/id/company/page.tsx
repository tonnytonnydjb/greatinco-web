import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CompanyPage } from "@/components/company/CompanyPage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getCompanyPageBySlug, getCompanyPages } from "@/services/company";
import { getSiteChromeContent } from "@/services/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCompanyPageBySlug("id", "company");

  if (!page) {
    return {
      title: "Perusahaan | Greatinco",
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

export default async function IndonesianCompanyPage() {
  const [page, pages, chrome] = await Promise.all([
    getCompanyPageBySlug("id", "company"),
    getCompanyPages("id"),
    getSiteChromeContent("id"),
  ]);

  if (!page) {
    notFound();
  }

  return (
    <>
      <SiteHeader locale="id" navigation={chrome.headerNavigation} settings={chrome.settings} />

      <CompanyPage locale="id" page={page} pages={pages} />

      <SiteFooter locale="id" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

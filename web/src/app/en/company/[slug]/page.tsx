import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CompanyPage } from "@/components/company/CompanyPage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getCompanyPageBySlug, getCompanyPages } from "@/services/company";
import { getSiteChromeContent } from "@/services/cms";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCompanyPageBySlug("en", slug);

  if (!page) {
    return {
      title: "Page Not Found | Greatinco",
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

export default async function EnglishCompanyDetailPage({ params }: Props) {
  const { slug } = await params;

  if (slug === "company") {
    redirect("/en/company");
  }

  const [page, pages, chrome] = await Promise.all([
    getCompanyPageBySlug("en", slug),
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

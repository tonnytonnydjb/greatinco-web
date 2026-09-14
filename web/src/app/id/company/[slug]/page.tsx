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
  const page = await getCompanyPageBySlug("id", slug);

  if (!page) {
    return {
      title: "Halaman Tidak Ditemukan | Greatinco",
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

export default async function IndonesianCompanyDetailPage({ params }: Props) {
  const { slug } = await params;

  if (slug === "company") {
    redirect("/id/company");
  }

  const [page, pages, chrome] = await Promise.all([
    getCompanyPageBySlug("id", slug),
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

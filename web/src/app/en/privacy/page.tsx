import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage } from "@/components/legal/LegalPage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteChromeContent } from "@/services/cms";
import { getLegalPage } from "@/services/legal";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage("en", "privacy");

  if (!page) {
    return {
      title: "Privacy Policy | Greatinco",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: page.seoTitle,
    description: page.seoDescription,
  };
}

export default async function EnglishPrivacyPage() {
  const [page, chrome] = await Promise.all([
    getLegalPage("en", "privacy"),
    getSiteChromeContent("en"),
  ]);

  if (!page) notFound();

  return (
    <>
      <SiteHeader locale="en" navigation={chrome.headerNavigation} settings={chrome.settings} />
      <LegalPage page={page} />
      <SiteFooter locale="en" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

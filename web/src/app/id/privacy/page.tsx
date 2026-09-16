import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage } from "@/components/legal/LegalPage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteChromeContent } from "@/services/cms";
import { getLegalPage } from "@/services/legal";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage("id", "privacy");

  if (!page) {
    return {
      title: "Kebijakan Privasi | Greatinco",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: page.seoTitle,
    description: page.seoDescription,
  };
}

export default async function IndonesianPrivacyPage() {
  const [page, chrome] = await Promise.all([
    getLegalPage("id", "privacy"),
    getSiteChromeContent("id"),
  ]);

  if (!page) notFound();

  return (
    <>
      <SiteHeader locale="id" navigation={chrome.headerNavigation} settings={chrome.settings} />
      <LegalPage page={page} />
      <SiteFooter locale="id" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CareerDetailPage } from "@/components/careers/CareerDetailPage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

import { getVacancyBySlug } from "@/services/careers";
import { getSiteChromeContent } from "@/services/cms";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const vacancy = await getVacancyBySlug("en", slug);

  if (!vacancy) {
    return {
      title: "Vacancy Not Found | Greatinco",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: vacancy.seoTitle,
    description: vacancy.seoDescription,
  };
}

export default async function EnglishCareerDetailPage({ params }: Props) {
  const { slug } = await params;

  const [vacancy, chrome] = await Promise.all([
    getVacancyBySlug("en", slug),
    getSiteChromeContent("en"),
  ]);

  if (!vacancy) {
    notFound();
  }

  return (
    <>
      <SiteHeader locale="en" navigation={chrome.headerNavigation} settings={chrome.settings} />

      <CareerDetailPage locale="en" vacancy={vacancy} />

      <SiteFooter locale="en" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

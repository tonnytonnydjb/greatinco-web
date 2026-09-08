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

  const vacancy = await getVacancyBySlug("id", slug);

  if (!vacancy) {
    return {
      title: "Lowongan Tidak Ditemukan | Greatinco",
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

export default async function IndonesianCareerDetailPage({ params }: Props) {
  const { slug } = await params;

  const [vacancy, chrome] = await Promise.all([
    getVacancyBySlug("id", slug),
    getSiteChromeContent("id"),
  ]);

  if (!vacancy) {
    notFound();
  }

  return (
    <>
      <SiteHeader locale="id" navigation={chrome.headerNavigation} settings={chrome.settings} />

      <CareerDetailPage locale="id" vacancy={vacancy} />

      <SiteFooter locale="id" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

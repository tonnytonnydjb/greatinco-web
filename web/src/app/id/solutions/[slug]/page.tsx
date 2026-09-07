import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SolutionDetailPage } from "@/components/solutions/SolutionDetailPage";

import { getSiteChromeContent } from "@/services/cms";

import { getSolutionBySlug } from "@/services/solutions";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const solution = await getSolutionBySlug("id", slug);

  if (!solution) {
    return {
      title: "Solusi Tidak Ditemukan | Greatinco",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: solution.seoTitle,
    description: solution.seoDescription,
  };
}

export default async function IndonesianSolutionDetailPage({ params }: Props) {
  const { slug } = await params;

  const [solution, chrome] = await Promise.all([
    getSolutionBySlug("id", slug),
    getSiteChromeContent("id"),
  ]);

  if (!solution) {
    notFound();
  }

  return (
    <>
      <SiteHeader locale="id" navigation={chrome.headerNavigation} settings={chrome.settings} />

      <SolutionDetailPage locale="id" solution={solution} />

      <SiteFooter locale="id" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

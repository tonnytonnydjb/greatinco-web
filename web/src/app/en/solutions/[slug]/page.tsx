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

  const solution = await getSolutionBySlug("en", slug);

  if (!solution) {
    return {
      title: "Solution Not Found | Greatinco",
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

export default async function EnglishSolutionDetailPage({ params }: Props) {
  const { slug } = await params;

  const [solution, chrome] = await Promise.all([
    getSolutionBySlug("en", slug),
    getSiteChromeContent("en"),
  ]);

  if (!solution) {
    notFound();
  }

  return (
    <>
      <SiteHeader locale="en" navigation={chrome.headerNavigation} settings={chrome.settings} />

      <SolutionDetailPage locale="en" solution={solution} />

      <SiteFooter locale="en" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

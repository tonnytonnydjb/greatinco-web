import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { getHomepageContent } from "@/services/cms";

export default async function IndonesianHomepage() {
  const content = await getHomepageContent("id");

  return (
    <>
      <SiteHeader locale="id" />

      <main>
        <Hero content={content.hero} />
        <HomeSections locale="id" />
      </main>

      <SiteFooter locale="id" />
    </>
  );
}

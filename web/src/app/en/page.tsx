import { ClientMarquee } from "@/components/home/ClientMarquee";
import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getHomepageContent } from "@/services/cms";

export default async function EnglishHomepage() {
  const content = await getHomepageContent("en");

  return (
    <>
      <SiteHeader locale="en" />

      <main>
        <Hero content={content.hero} />
        <ClientMarquee clients={content.clients} locale="en" />
        <HomeSections locale="en" />
      </main>

      <SiteFooter locale="en" />
    </>
  );
}

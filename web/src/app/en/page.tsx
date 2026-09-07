import { ActivityPreview } from "@/components/home/ActivityPreview";
import { ClientMarquee } from "@/components/home/ClientMarquee";
import { FinalCta } from "@/components/home/FinalCta";
import { GovernanceSection } from "@/components/home/GovernanceSection";
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
        <Hero content={content.hero} locale="en" />

        <ClientMarquee clients={content.clients} locale="en" />

        <HomeSections
          locale="en"
          capabilities={content.capabilities}
          solutionsSection={content.solutionsSection}
          solutions={content.solutions}
        />

        <GovernanceSection
          governance={content.governance}
          certifications={content.certifications}
        />

        <ActivityPreview locale="en" />

        <FinalCta locale="en" />
      </main>

      <SiteFooter locale="en" />
    </>
  );
}

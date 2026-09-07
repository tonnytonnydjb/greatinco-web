import { ActivityPreview } from "@/components/home/ActivityPreview";
import { ClientMarquee } from "@/components/home/ClientMarquee";
import { FinalCta } from "@/components/home/FinalCta";
import { GovernanceSection } from "@/components/home/GovernanceSection";
import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getHomepageContent } from "@/services/cms";

export default async function IndonesianHomepage() {
  const content = await getHomepageContent("id");

  return (
    <>
      <SiteHeader locale="id" />

      <main>
        <Hero content={content.hero} locale="id" />

        <ClientMarquee clients={content.clients} locale="id" />

        <HomeSections
          locale="id"
          capabilities={content.capabilities}
          solutionsSection={content.solutionsSection}
          solutions={content.solutions}
        />

        <GovernanceSection
          governance={content.governance}
          certifications={content.certifications}
        />

        <ActivityPreview
          locale="id"
          section={content.activitiesSection}
          activities={content.activities}
        />

        <FinalCta locale="id" content={content.finalCta} />
      </main>

      <SiteFooter locale="id" />
    </>
  );
}

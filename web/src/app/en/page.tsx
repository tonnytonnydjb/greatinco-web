import { ActivityPreview } from "@/components/home/ActivityPreview";
import { ClientMarquee } from "@/components/home/ClientMarquee";
import { FinalCta } from "@/components/home/FinalCta";
import { GovernanceSection } from "@/components/home/GovernanceSection";
import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getHomepageContent, getSiteChromeContent } from "@/services/cms";

export default async function EnglishHomepage() {
  const [content, chrome] = await Promise.all([
    getHomepageContent("en"),
    getSiteChromeContent("en"),
  ]);

  return (
    <>
      <SiteHeader locale="en" navigation={chrome.headerNavigation} settings={chrome.settings} />

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

        <ActivityPreview
          locale="en"
          section={content.activitiesSection}
          activities={content.activities}
        />

        <FinalCta locale="en" content={content.finalCta} />
      </main>

      <SiteFooter locale="en" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

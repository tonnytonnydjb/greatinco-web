import Image from "next/image";
import Link from "next/link";
import type { ActivityContent, HomepageSectionContent } from "@/types/cms";

type Props = {
  locale: "id" | "en";
  section: HomepageSectionContent;
  activities: ActivityContent[];
};

const categoryLabels = {
  id: {
    company_activity: "Aktivitas Perusahaan",
    team_activity: "Aktivitas Tim",
    training: "Pengembangan Tim",
    csr: "CSR",
    event: "Acara",
    announcement: "Pengumuman",
    other: "Aktivitas",
  },
  en: {
    company_activity: "Company Activity",
    team_activity: "Team Activity",
    training: "People Development",
    csr: "CSR",
    event: "Event",
    announcement: "Announcement",
    other: "Activity",
  },
};

export function ActivityPreview({ locale, section, activities }: Props) {
  if (activities.length === 0) {
    return null;
  }

  const featured = activities[0];
  const supporting = activities.slice(1);

  function categoryLabel(category: string) {
    const labels = categoryLabels[locale];

    return labels[category as keyof typeof labels] ?? labels.other;
  }

  return (
    <section className="activity-editorial-section">
      <div className="gi-container activity-editorial-header">
        <div>
          <div className="gi-eyebrow">{section.eyebrow}</div>

          <h2 className="gi-heading">{section.title}</h2>

          {section.description && (
            <p className="activity-editorial-description">{section.description}</p>
          )}
        </div>

        <Link href={`/${locale}/activities`} className="activity-editorial-link">
          {locale === "id" ? "Lihat Semua Aktivitas" : "View All Activities"}

          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="gi-container activity-editorial-grid">
        <Link href={featured.href} className="activity-featured">
          <div className="activity-featured-image">
            <Image
              src={featured.image.src}
              alt={featured.image.alt}
              fill
              sizes="(max-width: 900px) 100vw, 66vw"
            />
          </div>

          <div className="activity-featured-copy">
            <span>{categoryLabel(featured.category)}</span>
            <h3>{featured.title}</h3>

            {featured.summary && <p>{featured.summary}</p>}
          </div>
        </Link>

        <div className="activity-supporting-list">
          {supporting.map((item) => (
            <Link href={item.href} className="activity-supporting" key={item.id}>
              <div className="activity-supporting-image">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 34vw"
                />
              </div>

              <div className="activity-supporting-copy">
                <span>{categoryLabel(item.category)}</span>
                <h3>{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

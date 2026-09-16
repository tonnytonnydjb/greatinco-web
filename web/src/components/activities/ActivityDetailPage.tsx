import Image from "next/image";
import Link from "next/link";
import type { ActivityContent, SiteLocale } from "@/types/cms";

type Props = {
  locale: SiteLocale;
  activity: ActivityContent;
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

function categoryLabel(locale: SiteLocale, category: string) {
  const map = categoryLabels[locale];
  return map[category as keyof typeof map] ?? map.other;
}

function formatDate(locale: SiteLocale, value: string) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function ActivityDetailPage({ locale, activity }: Props) {
  return (
    <main className="activity-detail-v2">
      <section className="activity-detail-v2-head">
        <div className="gi-container activity-detail-v2-head-inner">
          <Link
            href={`/${locale}/activities`}
            className="activity-detail-v2-back"
          >
            ← {locale === "id" ? "Semua Aktivitas" : "All Activities"}
          </Link>

          <div className="activity-detail-v2-meta">
            <span>{categoryLabel(locale, activity.category)}</span>

            {activity.activityDate && (
              <time>{formatDate(locale, activity.activityDate)}</time>
            )}
          </div>

          <h1>{activity.title}</h1>

          {activity.summary && (
            <p className="activity-detail-v2-summary">
              {activity.summary}
            </p>
          )}
        </div>
      </section>

      <section className="activity-detail-v2-media">
        <div className="gi-container">
          <div className="activity-detail-v2-image">
            <Image
              src={activity.image.src}
              alt={activity.image.alt}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </div>
      </section>

      {activity.gallery.length > 0 && (
        <section className="activity-detail-v2-gallery-section">
          <div className="gi-container">
            <div className="activity-detail-v2-gallery-head">
              <div>
                <div className="gi-eyebrow">
                  {locale === "id" ? "Dokumentasi" : "Documentation"}
                </div>

                <h2>
                  {locale === "id" ? "Galeri Aktivitas" : "Activity Gallery"}
                </h2>
              </div>

              <span>
                {activity.gallery.length}{" "}
                {locale === "id" ? "foto" : "photos"}
              </span>
            </div>

            <div className="activity-detail-v2-gallery-grid">
              {activity.gallery.map((image, index) => (
                <div
                  className="activity-detail-v2-gallery-image"
                  key={`${image.src}-${index}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

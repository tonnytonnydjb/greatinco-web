import Image from "next/image";
import Link from "next/link";
import type { ActivityContent, SiteLocale } from "@/types/cms";

type Props = {
  locale: SiteLocale;
  activities: ActivityContent[];
};

const labels = {
  id: {
    eyebrow: "Kegiatan & Wawasan",
    title: "Aktivitas Greatinco",
    description:
      "Ikuti kegiatan perusahaan, pengembangan tim, acara, dan berbagai inisiatif Greatinco.",
    empty: "Belum ada aktivitas yang dipublikasikan.",
    gallery: "Lihat Galeri",
  },
  en: {
    eyebrow: "Activities & Insights",
    title: "Greatinco Activities",
    description:
      "Explore company activities, people development, events and initiatives across Greatinco.",
    empty: "No activities have been published yet.",
    gallery: "View Gallery",
  },
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
  if (!value) return "";

  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function ActivitiesIndex({ locale, activities }: Props) {
  const copy = labels[locale];

  return (
    <main className="activities-v2">
      <section className="activities-v2-hero">
        <div className="gi-container activities-v2-hero-inner">
          <div>
            <div className="gi-eyebrow">{copy.eyebrow}</div>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
          </div>

          <Link
            href={`/${locale}/activities/gallery`}
            className="activities-v2-gallery-link"
          >
            {copy.gallery}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="activities-v2-list">
        <div className="gi-container">
          {activities.length === 0 ? (
            <p className="activities-v2-empty">{copy.empty}</p>
          ) : (
            <div className="activities-v2-grid">
              {activities.map((activity) => (
                <Link
                  href={activity.href}
                  className="activities-v2-card"
                  key={activity.id}
                >
                  <div className="activities-v2-card-image">
                    <Image
                      src={activity.image.src}
                      alt={activity.image.alt}
                      fill
                      sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                  </div>

                  <div className="activities-v2-card-meta">
                    <span>{categoryLabel(locale, activity.category)}</span>
                    {activity.activityDate && (
                      <>
                        <i aria-hidden="true" />
                        <time>{formatDate(locale, activity.activityDate)}</time>
                      </>
                    )}
                  </div>

                  <h2>{activity.title}</h2>

                  {activity.summary && <p>{activity.summary}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

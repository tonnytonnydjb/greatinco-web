import Image from "next/image";
import Link from "next/link";
import type { ActivityContent, SiteLocale } from "@/types/cms";

type Props = {
  locale: SiteLocale;
  activities: ActivityContent[];
};

export function ActivityGallery({ locale, activities }: Props) {
  return (
    <main className="activity-gallery-v2">
      <section className="activity-gallery-v2-head">
        <div className="gi-container">
          <Link href={`/${locale}/activities`} className="activity-detail-v2-back">
            ← {locale === "id" ? "Semua Aktivitas" : "All Activities"}
          </Link>

          <div className="gi-eyebrow">
            {locale === "id" ? "Dokumentasi" : "Documentation"}
          </div>

          <h1>{locale === "id" ? "Galeri Aktivitas" : "Activity Gallery"}</h1>
        </div>
      </section>

      <section className="activity-gallery-v2-grid-section">
        <div className="gi-container activity-gallery-v2-grid">
          {activities.map((activity) => (
            <Link href={activity.href} key={activity.id} className="activity-gallery-v2-item">
              <div className="activity-gallery-v2-image">
                <Image
                  src={activity.image.src}
                  alt={activity.image.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              </div>

              <span>{activity.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

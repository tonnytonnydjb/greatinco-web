import Image from "next/image";
import Link from "next/link";
import type { SiteLocale } from "@/config/site";

type Props = {
  locale: SiteLocale;
};

export function ActivityPreview({ locale }: Props) {
  const isId = locale === "id";

  const featured = {
    title: isId
      ? "Membangun kolaborasi melalui kebersamaan tim."
      : "Building collaboration through shared team experiences.",
    category: isId ? "Aktivitas Perusahaan" : "Company Activity",
    image: "/activities/bukber-ho-2026-1.jpeg",
  };

  const supporting = [
    {
      title: isId ? "Kebersamaan tim Greatinco Malang" : "Greatinco Malang team gathering",
      category: isId ? "Aktivitas Tim" : "Team Activity",
      image: "/activities/bukber-malang-2026.jpeg",
    },
    {
      title: isId
        ? "Pengembangan kompetensi melalui pelatihan dan penyegaran"
        : "Developing capability through training and refreshment",
      category: isId ? "Pengembangan Tim" : "People Development",
      image: "/activities/training-refreshment.jpg",
    },
  ];

  return (
    <section className="activity-editorial-section">
      <div className="gi-container activity-editorial-header">
        <div>
          <div className="gi-eyebrow">{isId ? "Aktivitas Greatinco" : "Life at Greatinco"}</div>

          <h2 className="gi-heading">
            {isId
              ? "Budaya kerja yang dibangun melalui kolaborasi, pembelajaran, dan kebersamaan."
              : "A working culture built through collaboration, learning and shared experiences."}
          </h2>
        </div>

        <Link href={`/${locale}/activities`} className="activity-editorial-link">
          {isId ? "Lihat Semua Aktivitas" : "View All Activities"}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="gi-container activity-editorial-grid">
        <article className="activity-featured">
          <div className="activity-featured-image">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              sizes="(max-width: 900px) 100vw, 66vw"
              priority={false}
            />
          </div>

          <div className="activity-featured-copy">
            <span>{featured.category}</span>
            <h3>{featured.title}</h3>
          </div>
        </article>

        <div className="activity-supporting-list">
          {supporting.map((item) => (
            <article className="activity-supporting" key={item.title}>
              <div className="activity-supporting-image">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 34vw"
                />
              </div>

              <div className="activity-supporting-copy">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

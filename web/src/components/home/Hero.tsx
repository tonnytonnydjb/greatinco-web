import Link from "next/link";
import type { HeroContent } from "@/types/cms";

type Props = {
  content: HeroContent;
  locale: "id" | "en";
};

export function Hero({ content, locale }: Props) {
  const lifecycle =
    locale === "id"
      ? [
          "Strategi Portofolio",
          "Pengelolaan Kredit",
          "Penagihan & Pemulihan",
          "Analitik & Optimalisasi",
        ]
      : [
          "Portfolio Strategy",
          "Credit Servicing",
          "Collection & Recovery",
          "Analytics & Optimization",
        ];

  return (
    <section className={`hero hero-${locale}`}>
      <div className="gi-container hero-shell">
        <div className="hero-main">
          <div className="hero-copy">
            <div className="hero-eyebrow">{content.eyebrow}</div>

            <h1 className="hero-title">{content.title}</h1>

            <p className="hero-description">{content.description}</p>

            <div className="hero-actions">
              {content.primaryCta && (
                <Link href={content.primaryCta.href} className="hero-primary">
                  <span>{content.primaryCta.label}</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              )}

              {content.secondaryCta && (
                <Link href={content.secondaryCta.href} className="hero-secondary">
                  <span>{content.secondaryCta.label}</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              )}
            </div>
          </div>

          <aside className="hero-lifecycle">
            <div className="hero-lifecycle-label">
              {locale === "id" ? "Siklus Manajemen Kredit" : "Credit Management Lifecycle"}
            </div>

            <div className="hero-lifecycle-list">
              {lifecycle.map((item, index) => (
                <div className="hero-lifecycle-item" key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

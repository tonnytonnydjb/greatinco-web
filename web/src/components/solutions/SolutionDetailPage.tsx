import Image from "next/image";
import Link from "next/link";

import type { SiteLocale } from "@/types/cms";

import type { SolutionDetail } from "@/services/solutions";

type Props = {
  locale: SiteLocale;
  solution: SolutionDetail;
};

export function SolutionDetailPage({ locale, solution }: Props) {
  const isId = locale === "id";

  return (
    <main>
      <section className="solution-detail-hero">
        <div className="gi-container solution-detail-hero-grid">
          <div className="solution-detail-copy">
            <div className="gi-eyebrow">{isId ? "SOLUSI GREATINCO" : "GREATINCO SOLUTION"}</div>

            <h1>{solution.heroTitle}</h1>

            {solution.heroDescription && <p>{solution.heroDescription}</p>}

            <div className="solution-detail-actions">
              <Link href={`/${locale}/contact`} className="hero-primary">
                {isId ? "Diskusikan Kebutuhan Anda" : "Discuss Your Requirements"}
              </Link>

              <Link href={`/${locale}/solutions`} className="hero-secondary">
                {isId ? "Semua Solusi" : "All Solutions"}
              </Link>
            </div>
          </div>

          {solution.heroImage?.src && (
            <div className="solution-detail-image">
              <Image
                src={solution.heroImage.src}
                alt={solution.heroImage.alt}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 42vw"
              />
            </div>
          )}
        </div>
      </section>

      <section className="solution-detail-body">
        <div className="gi-container solution-detail-body-grid">
          <aside className="solution-detail-aside">
            <span>{isId ? "KAPABILITAS" : "CAPABILITY"}</span>

            <strong>{solution.title}</strong>
          </aside>

          <div className="solution-detail-content">
            {solution.shortDescription && (
              <p className="solution-detail-lead">{solution.shortDescription}</p>
            )}

            {solution.content.length > 0 ? (
              solution.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p>
                {isId
                  ? "Informasi lebih lengkap mengenai solusi ini dapat didiskusikan bersama tim Greatinco."
                  : "Further information about this solution can be discussed with the Greatinco team."}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="solution-detail-cta">
        <div className="gi-container solution-detail-cta-inner">
          <div>
            <span>{isId ? "LANGKAH BERIKUTNYA" : "NEXT STEP"}</span>

            <h2>
              {isId
                ? "Mari diskusikan kebutuhan portofolio Anda."
                : "Let's discuss your portfolio requirements."}
            </h2>
          </div>

          <Link href={`/${locale}/contact`} className="solution-detail-cta-link">
            {isId ? "Hubungi Kami" : "Contact Us"}

            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

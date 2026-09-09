import Link from "next/link";

import { CareerApplicationForm } from "@/components/careers/CareerApplicationForm";

import type { VacancyDetail } from "@/services/careers";
import type { SiteLocale } from "@/types/cms";

type Props = {
  locale: SiteLocale;
  vacancy: VacancyDetail;
};

function formatDate(value: string, locale: SiteLocale) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function CareerDetailPage({ locale, vacancy }: Props) {
  const isId = locale === "id";

  return (
    <main>
      <section className="career-detail-hero">
        <div className="gi-container career-detail-hero-inner">
          <div className="gi-eyebrow">{isId ? "KARIER DI GREATINCO" : "CAREERS AT GREATINCO"}</div>

          <h1>{vacancy.title}</h1>

          {vacancy.summary && <p>{vacancy.summary}</p>}

          <div className="career-detail-meta">
            {vacancy.department && <span>{vacancy.department}</span>}

            {vacancy.location && <span>{vacancy.location}</span>}

            {vacancy.employmentType && <span>{vacancy.employmentType}</span>}
          </div>
        </div>
      </section>

      <section className="career-detail-body">
        <div className="gi-container career-detail-grid">
          <aside className="career-detail-aside">
            <div>
              <span>{isId ? "POSISI" : "POSITION"}</span>

              <strong>{vacancy.title}</strong>
            </div>

            {vacancy.closingDate && (
              <div>
                <span>{isId ? "BATAS LAMARAN" : "APPLICATION DEADLINE"}</span>

                <strong>{formatDate(vacancy.closingDate, locale)}</strong>
              </div>
            )}

            <Link href="#apply" className="career-apply-button">
              {isId ? "Lamar Posisi Ini" : "Apply for This Role"}
            </Link>
          </aside>

          <div className="career-detail-content">
            {vacancy.description.length > 0 && (
              <section>
                <h2>{isId ? "Tentang Posisi" : "About the Role"}</h2>

                {vacancy.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </section>
            )}

            {vacancy.requirements.length > 0 && (
              <section>
                <h2>{isId ? "Kualifikasi" : "Requirements"}</h2>

                <ul>
                  {vacancy.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {vacancy.benefits.length > 0 && (
              <section>
                <h2>{isId ? "Apa yang Kami Tawarkan" : "What We Offer"}</h2>

                <ul>
                  {vacancy.benefits.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            <CareerApplicationForm
              locale={locale}
              vacancySlug={vacancy.slug}
              vacancyTitle={vacancy.title}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

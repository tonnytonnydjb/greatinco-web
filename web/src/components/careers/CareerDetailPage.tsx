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
    <main className="career-detail-v2">
      <section className="career-detail-v2-hero">
        <div className="gi-container career-detail-v2-hero-grid">
          <div className="career-detail-v2-copy">
            <div className="gi-eyebrow">
              {isId ? "KARIER DI GREATINCO" : "CAREERS AT GREATINCO"}
            </div>

            <h1>{vacancy.title}</h1>

            {vacancy.summary && <p>{vacancy.summary}</p>}

            <div className="career-detail-v2-meta">
              {vacancy.department && <span>{vacancy.department}</span>}
              {vacancy.location && <span>{vacancy.location}</span>}
              {vacancy.employmentType && <span>{vacancy.employmentType}</span>}
            </div>
          </div>

          <aside className="career-detail-v2-summary">
            <span>{isId ? "ROLE OVERVIEW" : "ROLE OVERVIEW"}</span>

            <div>
              <small>{isId ? "POSISI" : "POSITION"}</small>
              <strong>{vacancy.title}</strong>
            </div>

            {vacancy.closingDate && (
              <div>
                <small>{isId ? "BATAS LAMARAN" : "APPLICATION DEADLINE"}</small>
                <strong>{formatDate(vacancy.closingDate, locale)}</strong>
              </div>
            )}

            <Link href="#apply">
              {isId ? "Lamar posisi ini" : "Apply for this role"}
              <span aria-hidden="true">↓</span>
            </Link>
          </aside>
        </div>
      </section>

      <section className="career-detail-v2-body">
        <div className="gi-container career-detail-v2-grid">
          <aside className="career-detail-v2-nav">
            <span>{isId ? "INFORMASI POSISI" : "ROLE INFORMATION"}</span>

            <nav>
              {vacancy.description.length > 0 && (
                <a href="#about-role">{isId ? "Tentang posisi" : "About the role"}</a>
              )}

              {vacancy.requirements.length > 0 && (
                <a href="#requirements">{isId ? "Kualifikasi" : "Requirements"}</a>
              )}

              {vacancy.benefits.length > 0 && (
                <a href="#benefits">{isId ? "Yang kami tawarkan" : "What we offer"}</a>
              )}

              <a href="#apply">{isId ? "Lamar posisi" : "Apply now"}</a>
            </nav>
          </aside>

          <div className="career-detail-v2-content">
            {vacancy.description.length > 0 && (
              <section id="about-role">
                <span>01</span>
                <h2>{isId ? "Tentang Posisi" : "About the Role"}</h2>

                {vacancy.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </section>
            )}

            {vacancy.requirements.length > 0 && (
              <section id="requirements">
                <span>02</span>
                <h2>{isId ? "Kualifikasi" : "Requirements"}</h2>

                <ul>
                  {vacancy.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {vacancy.benefits.length > 0 && (
              <section id="benefits">
                <span>03</span>
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

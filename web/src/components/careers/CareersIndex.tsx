import Link from "next/link";

import type { SiteLocale } from "@/types/cms";
import type { VacancyListItem } from "@/services/careers";

type Props = {
  locale: SiteLocale;
  vacancies: VacancyListItem[];
};

export function CareersIndex({ locale, vacancies }: Props) {
  const isId = locale === "id";

  return (
    <main>
      <section className="careers-hero">
        <div className="gi-container careers-hero-inner">
          <div className="gi-eyebrow">{isId ? "KARIER DI GREATINCO" : "CAREERS AT GREATINCO"}</div>

          <h1>
            {isId
              ? "Bangun karier bersama tim yang berorientasi pada hasil."
              : "Build your career with an outcome-driven team."}
          </h1>

          <p>
            {isId
              ? "Kami mencari individu yang ingin berkembang, mengambil tanggung jawab, dan berkontribusi dalam industri pengelolaan kredit dan layanan keuangan."
              : "We look for people who want to grow, take ownership and contribute to the credit management and financial services industry."}
          </p>
        </div>
      </section>

      <section className="careers-list-section">
        <div className="gi-container">
          <div className="careers-list-heading">
            <div>
              <div className="gi-eyebrow">{isId ? "POSISI TERBUKA" : "OPEN POSITIONS"}</div>

              <h2>{isId ? "Temukan peluang yang sesuai." : "Find the right opportunity."}</h2>
            </div>

            <span>
              {vacancies.length}{" "}
              {isId ? "posisi" : vacancies.length === 1 ? "position" : "positions"}
            </span>
          </div>

          {vacancies.length === 0 ? (
            <div className="careers-empty">
              <h3>{isId ? "Belum ada posisi terbuka." : "No open positions at the moment."}</h3>

              <p>
                {isId
                  ? "Silakan kembali lagi untuk melihat peluang karier terbaru di Greatinco."
                  : "Please check back for future opportunities at Greatinco."}
              </p>
            </div>
          ) : (
            <div className="careers-list">
              {vacancies.map((vacancy) => (
                <Link key={vacancy.id} href={vacancy.href} className="career-row">
                  <div className="career-row-main">
                    <span>{vacancy.department || (isId ? "Greatinco" : "Greatinco")}</span>

                    <h3>{vacancy.title}</h3>

                    {vacancy.summary && <p>{vacancy.summary}</p>}
                  </div>

                  <div className="career-row-meta">
                    {vacancy.location && <span>{vacancy.location}</span>}

                    {vacancy.employmentType && <span>{vacancy.employmentType}</span>}

                    <strong aria-hidden="true">↗</strong>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

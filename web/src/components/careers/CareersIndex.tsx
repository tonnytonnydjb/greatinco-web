import Link from "next/link";

import type { VacancyListItem } from "@/services/careers";
import type { SiteLocale } from "@/types/cms";

type Props = {
  locale: SiteLocale;
  vacancies: VacancyListItem[];
};

export function CareersIndex({ locale, vacancies }: Props) {
  const isId = locale === "id";

  const values = isId
    ? [
        {
          number: "01",
          title: "Kerja yang berdampak",
          description:
            "Berkontribusi langsung pada layanan dan operasi yang memiliki dampak nyata bagi klien dan bisnis.",
        },
        {
          number: "02",
          title: "Tumbuh dengan keahlian",
          description:
            "Bangun kompetensi melalui pengalaman operasional, teknologi, dan pemahaman industri.",
        },
        {
          number: "03",
          title: "Bekerja dengan standar",
          description: "Disiplin, kualitas, dan tata kelola menjadi bagian dari cara kami bekerja.",
        },
        {
          number: "04",
          title: "Berkembang bersama",
          description:
            "Kolaborasi lintas fungsi untuk menyelesaikan tantangan dan menciptakan hasil.",
        },
      ]
    : [
        {
          number: "01",
          title: "Work with impact",
          description:
            "Contribute directly to services and operations that create measurable value for clients and the business.",
        },
        {
          number: "02",
          title: "Grow with expertise",
          description: "Build capability through operational, technology and industry experience.",
        },
        {
          number: "03",
          title: "Operate with standards",
          description: "Discipline, quality and governance are part of how we work.",
        },
        {
          number: "04",
          title: "Build together",
          description: "Collaborate across functions to solve challenges and deliver outcomes.",
        },
      ];

  const hiringSteps = isId
    ? ["Kirim lamaran", "Review", "Interview", "Penawaran"]
    : ["Apply", "Review", "Interview", "Offer"];

  return (
    <main className="careers-v2">
      <section className="careers-v2-hero">
        <div className="gi-container careers-v2-hero-grid">
          <div className="careers-v2-hero-copy">
            <div className="gi-eyebrow">
              {isId ? "KARIER DI GREATINCO" : "CAREERS AT GREATINCO"}
            </div>

            <h1>
              {isId
                ? "Bangun karier dengan pekerjaan yang memiliki dampak."
                : "Build your career through work that creates impact."}
            </h1>

            <p>
              {isId
                ? "Kami mencari individu yang ingin berkembang, mengambil tanggung jawab, dan membangun standar baru dalam industri pengelolaan kredit dan layanan keuangan."
                : "We look for people who want to grow, take ownership and raise the standard across credit management and financial services."}
            </p>

            <a href="#open-positions" className="careers-v2-hero-action">
              {isId ? "Lihat posisi terbuka" : "View open positions"}
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <aside className="careers-v2-hero-aside">
            <span>{isId ? "BEKERJA DI GREATINCO" : "WORK AT GREATINCO"}</span>

            <div className="careers-v2-hero-fact">
              <strong>{String(vacancies.length).padStart(2, "0")}</strong>
              <p>{isId ? "posisi terbuka saat ini" : "open positions today"}</p>
            </div>

            <div className="careers-v2-hero-lines">
              <span>Credit & Financial Services</span>
              <span>Technology-enabled Operations</span>
              <span>Performance-driven Culture</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="careers-v2-values">
        <div className="gi-container">
          <header className="careers-v2-section-heading">
            <div className="gi-eyebrow">{isId ? "MENGAPA GREATINCO" : "WHY GREATINCO"}</div>

            <h2>
              {isId
                ? "Tempat untuk tumbuh dengan tanggung jawab dan standar yang tinggi."
                : "A place to grow through ownership and high standards."}
            </h2>
          </header>

          <div className="careers-v2-values-grid">
            {values.map((value) => (
              <article key={value.number}>
                <span>{value.number}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="open-positions" className="careers-v2-openings">
        <div className="gi-container">
          <header className="careers-v2-openings-heading">
            <div>
              <div className="gi-eyebrow">{isId ? "POSISI TERBUKA" : "OPEN POSITIONS"}</div>

              <h2>{isId ? "Temukan peluang yang sesuai." : "Find the right opportunity."}</h2>
            </div>

            <div className="careers-v2-opening-count">
              <strong>{String(vacancies.length).padStart(2, "0")}</strong>
              <span>{isId ? "POSISI" : vacancies.length === 1 ? "POSITION" : "POSITIONS"}</span>
            </div>
          </header>

          {vacancies.length === 0 ? (
            <div className="careers-v2-empty">
              <h3>
                {isId
                  ? "Belum ada posisi terbuka saat ini."
                  : "There are no open positions at the moment."}
              </h3>

              <p>
                {isId
                  ? "Silakan kembali lagi untuk melihat peluang karier terbaru di Greatinco."
                  : "Please check back for future opportunities at Greatinco."}
              </p>
            </div>
          ) : (
            <div className="careers-v2-list">
              {vacancies.map((vacancy, index) => (
                <Link key={vacancy.id} href={vacancy.href} className="careers-v2-row">
                  <div className="careers-v2-row-number">{String(index + 1).padStart(2, "0")}</div>

                  <div className="careers-v2-row-main">
                    <span>{vacancy.department || "Greatinco"}</span>

                    <h3>{vacancy.title}</h3>

                    {vacancy.summary && <p>{vacancy.summary}</p>}
                  </div>

                  <div className="careers-v2-row-meta">
                    {vacancy.location && <span>{vacancy.location}</span>}
                    {vacancy.employmentType && <span>{vacancy.employmentType}</span>}

                    <strong>
                      {isId ? "Lihat posisi" : "View role"} <span aria-hidden="true">↗</span>
                    </strong>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="careers-v2-process">
        <div className="gi-container">
          <header>
            <div className="gi-eyebrow">{isId ? "PROSES REKRUTMEN" : "OUR HIRING PROCESS"}</div>

            <h2>
              {isId
                ? "Proses yang jelas dari aplikasi hingga penawaran."
                : "A clear process from application through offer."}
            </h2>
          </header>

          <div className="careers-v2-process-grid">
            {hiringSteps.map((step, index) => (
              <div key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

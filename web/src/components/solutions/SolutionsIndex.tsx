import Link from "next/link";

import type { SolutionListItem } from "@/services/solutions";
import type { SiteLocale } from "@/types/cms";

type Props = {
  locale: SiteLocale;
  solutions: SolutionListItem[];
};

export function SolutionsIndex({ locale, solutions }: Props) {
  const isId = locale === "id";
  const contactHref = `/${locale}/contact`;

  const operatingModel = isId
    ? [
        {
          number: "01",
          title: "Strategi",
          description:
            "Pendekatan yang disesuaikan dengan karakteristik portofolio dan objektif bisnis.",
        },
        {
          number: "02",
          title: "Eksekusi",
          description:
            "Operasional yang terstruktur melalui people, process, dan channel yang tepat.",
        },
        {
          number: "03",
          title: "Monitoring",
          description: "Pengukuran performa, kualitas, dan produktivitas secara disiplin.",
        },
        {
          number: "04",
          title: "Optimasi",
          description: "Perbaikan berkelanjutan berbasis hasil dan insight operasional.",
        },
      ]
    : [
        {
          number: "01",
          title: "Strategy",
          description:
            "An approach aligned with portfolio characteristics and business objectives.",
        },
        {
          number: "02",
          title: "Execution",
          description: "Structured operations across people, process and the right channels.",
        },
        {
          number: "03",
          title: "Monitoring",
          description: "Disciplined performance, quality and productivity measurement.",
        },
        {
          number: "04",
          title: "Optimization",
          description: "Continuous improvement based on operational outcomes and insight.",
        },
      ];

  return (
    <main className="solutions-v2">
      <section className="solutions-v2-hero">
        <div className="gi-container solutions-v2-hero-grid">
          <div className="solutions-v2-hero-copy">
            <div className="gi-eyebrow">{isId ? "SOLUSI GREATINCO" : "GREATINCO SOLUTIONS"}</div>

            <h1>
              {isId
                ? "Pengelolaan kredit yang terintegrasi untuk hasil yang terukur."
                : "Integrated credit management built for measurable outcomes."}
            </h1>

            <p>
              {isId
                ? "Dari strategi portofolio hingga desk dan field collection, Greatinco menggabungkan kapabilitas operasional, teknologi, dan tata kelola untuk mendukung performa pemulihan yang berkelanjutan."
                : "From portfolio strategy through desk and field collection, Greatinco combines operational capability, technology and governance to support sustainable recovery performance."}
            </p>

            <div className="solutions-v2-actions">
              <a href="#capabilities" className="solutions-v2-primary-action">
                {isId ? "Lihat kapabilitas" : "Explore capabilities"}
                <span aria-hidden="true">↓</span>
              </a>

              <Link href={contactHref} className="solutions-v2-secondary-action">
                {isId ? "Diskusikan kebutuhan Anda" : "Talk to our team"}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <aside className="solutions-v2-hero-aside">
            <span>{isId ? "MODEL LAYANAN" : "SERVICE MODEL"}</span>

            <div>
              <strong>{String(solutions.length).padStart(2, "0")}</strong>
              <p>{isId ? "kapabilitas utama" : "core capabilities"}</p>
            </div>

            <ul>
              <li>{isId ? "Multi-channel operations" : "Multi-channel operations"}</li>
              <li>{isId ? "Data-led execution" : "Data-led execution"}</li>
              <li>{isId ? "Quality & governance" : "Quality & governance"}</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="solutions-v2-capability-strip">
        <div className="gi-container solutions-v2-capability-strip-inner">
          <span>{isId ? "PORTFOLIO STRATEGY" : "PORTFOLIO STRATEGY"}</span>
          <span>{isId ? "CREDIT SERVICING" : "CREDIT SERVICING"}</span>
          <span>{isId ? "DESK COLLECTION" : "DESK COLLECTION"}</span>
          <span>{isId ? "FIELD OPERATIONS" : "FIELD OPERATIONS"}</span>
          <span>{isId ? "COLLECTION MANPOWER" : "COLLECTION MANPOWER"}</span>
        </div>
      </section>

      <section id="capabilities" className="solutions-v2-list">
        <div className="gi-container">
          <header className="solutions-v2-section-heading">
            <div>
              <div className="gi-eyebrow">{isId ? "KAPABILITAS" : "CAPABILITIES"}</div>

              <h2>
                {isId
                  ? "Solusi untuk setiap tahapan pengelolaan kredit."
                  : "Solutions across the credit management lifecycle."}
              </h2>
            </div>

            <p>
              {isId
                ? "Setiap layanan dirancang untuk berdiri sendiri maupun terintegrasi sebagai bagian dari operating model yang lebih luas."
                : "Each capability can operate independently or as part of a broader integrated operating model."}
            </p>
          </header>

          <div className="solutions-v2-service-list">
            {solutions.map((solution, index) => (
              <Link key={solution.id} href={solution.href} className="solutions-v2-service-row">
                <div className="solutions-v2-service-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="solutions-v2-service-copy">
                  <h3>{solution.title}</h3>

                  {solution.description && <p>{solution.description}</p>}
                </div>

                <div className="solutions-v2-service-link">
                  <span>{isId ? "Lihat solusi" : "Explore solution"}</span>
                  <strong aria-hidden="true">↗</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="solutions-v2-model">
        <div className="gi-container">
          <header className="solutions-v2-model-heading">
            <div className="gi-eyebrow">{isId ? "OPERATING MODEL" : "OPERATING MODEL"}</div>

            <h2>
              {isId
                ? "People, process, technology, dan governance dalam satu kerangka kerja."
                : "People, process, technology and governance in one operating framework."}
            </h2>
          </header>

          <div className="solutions-v2-model-grid">
            {operatingModel.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="solutions-v2-cta">
        <div className="gi-container solutions-v2-cta-inner">
          <div>
            <div className="gi-eyebrow">
              {isId ? "BERMITRA DENGAN GREATINCO" : "PARTNER WITH GREATINCO"}
            </div>

            <h2>
              {isId
                ? "Bangun operasi pemulihan yang lebih kuat."
                : "Build a stronger recovery operation."}
            </h2>
          </div>

          <Link href={contactHref}>
            {isId ? "Hubungi tim kami" : "Talk to our team"}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

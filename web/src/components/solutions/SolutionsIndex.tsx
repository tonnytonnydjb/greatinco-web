import Link from "next/link";

import type { SiteLocale } from "@/types/cms";

import type { SolutionListItem } from "@/services/solutions";

type Props = {
  locale: SiteLocale;
  solutions: SolutionListItem[];
};

export function SolutionsIndex({ locale, solutions }: Props) {
  const isId = locale === "id";

  return (
    <main>
      <section className="solutions-page-hero">
        <div className="gi-container solutions-page-hero-inner">
          <div className="gi-eyebrow">{isId ? "SOLUSI GREATINCO" : "GREATINCO SOLUTIONS"}</div>

          <h1>
            {isId
              ? "Solusi terintegrasi sepanjang siklus pengelolaan kredit."
              : "Integrated solutions across the credit management lifecycle."}
          </h1>

          <p>
            {isId
              ? "Kapabilitas yang dirancang untuk membantu institusi keuangan mengelola portofolio, meningkatkan efektivitas penagihan, dan memperkuat hasil pemulihan."
              : "Capabilities designed to help financial institutions manage portfolios, improve collection effectiveness, and strengthen recovery outcomes."}
          </p>
        </div>
      </section>

      <section className="solutions-page-list">
        <div className="gi-container">
          <div className="solutions-page-grid">
            {solutions.map((solution, index) => (
              <Link key={solution.id} href={solution.href} className="solution-page-card">
                <div className="solution-page-card-top">
                  <span>{String(index + 1).padStart(2, "0")}</span>

                  <span aria-hidden="true">↗</span>
                </div>

                <div>
                  <h2>{solution.title}</h2>

                  {solution.description && <p>{solution.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

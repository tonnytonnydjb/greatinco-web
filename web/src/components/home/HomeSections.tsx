import type { SiteLocale } from "@/config/site";

type Props = {
  locale: SiteLocale;
};

export function HomeSections({ locale }: Props) {
  const isId = locale === "id";

  return (
    <>
      <section className="trust-strip">
        <div className="gi-container trust-grid">
          <div>
            <div className="trust-number">15+</div>
            <div className="trust-label">
              {isId ? "Institusi Keuangan" : "Financial Institutions"}
            </div>
          </div>

          <div>
            <div className="trust-number">360°</div>
            <div className="trust-label">
              {isId ? "Pendekatan Kredit" : "Credit Management Approach"}
            </div>
          </div>

          <div>
            <div className="trust-number">ID</div>
            <div className="trust-label">{isId ? "Operasi Nasional" : "National Operations"}</div>
          </div>
        </div>
      </section>

      <section className="gi-section solutions-section">
        <div className="gi-container">
          <div className="solutions-heading">
            <div>
              <div className="gi-eyebrow">
                {isId ? "Solusi Terintegrasi" : "Integrated Solutions"}
              </div>

              <h2 className="gi-heading">
                {isId
                  ? "Mengelola performa kredit dari strategi hingga recovery."
                  : "Managing credit performance from strategy to recovery."}
              </h2>
            </div>

            <p>
              {isId
                ? "Greatinco menggabungkan strategi portofolio, collection operations, teknologi, analytics, dan governance dalam satu operating model."
                : "Greatinco combines portfolio strategy, collection operations, technology, analytics and governance within one operating model."}
            </p>
          </div>

          <div className="solution-grid">
            {[
              ["01", isId ? "Credit Servicing & Recovery" : "Credit Servicing & Recovery"],
              ["02", isId ? "Portfolio Strategy & Investment" : "Portfolio Strategy & Investment"],
              ["03", isId ? "Collection Operations" : "Collection Operations"],
              ["04", isId ? "Technology & Analytics" : "Technology & Analytics"],
            ].map(([number, title]) => (
              <article className="solution-card" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <div className="solution-arrow">↗</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

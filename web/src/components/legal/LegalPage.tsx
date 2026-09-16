import type { LegalPageContent } from "@/services/legal";

type Props = {
  page: LegalPageContent;
};

export function LegalPage({ page }: Props) {
  return (
    <main className="legal-v2">
      <section className="legal-v2-hero">
        <div className="gi-container">
          <div className="gi-eyebrow">Greatinco</div>
          <h1>{page.title}</h1>
        </div>
      </section>

      <section className="legal-v2-content-section">
        <div className="gi-container">
          <article
            className="legal-v2-content"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        </div>
      </section>
    </main>
  );
}

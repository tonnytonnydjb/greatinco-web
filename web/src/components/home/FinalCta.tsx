import Link from "next/link";
import type { HomepageContent } from "@/types/cms";

type Props = {
  locale: "id" | "en";
  content: HomepageContent["finalCta"];
};

export function FinalCta({ locale, content }: Props) {
  if (!content.title) {
    return null;
  }

  return (
    <section className="final-cta-section">
      <div className="gi-container final-cta-shell">
        <div className="final-cta-kicker">
          <span className="final-cta-index">01</span>
          <span>{content.eyebrow}</span>
        </div>

        <div className="final-cta-layout">
          <div className="final-cta-copy">
            <h2>{content.title}</h2>
          </div>

          <div className="final-cta-side">
            <p>{content.description}</p>

            <Link href={content.buttonHref} className="final-cta-button">
              <span>{content.buttonLabel}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className="final-cta-bottom">
          <span>
            {locale === "id"
              ? "Manajemen Kredit • Recovery • Solusi Portofolio"
              : "Credit Management • Recovery • Portfolio Solutions"}
          </span>

          <span>Greatinco</span>
        </div>
      </div>
    </section>
  );
}

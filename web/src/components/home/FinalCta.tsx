import Link from "next/link";
import type { SiteLocale } from "@/config/site";

type Props = {
  locale: SiteLocale;
};

export function FinalCta({ locale }: Props) {
  const isId = locale === "id";

  return (
    <section className="final-cta-section">
      <div className="gi-container final-cta-shell">
        <div className="final-cta-kicker">
          <span className="final-cta-index">01</span>
          <span>{isId ? "Mulai Percakapan" : "Start a Conversation"}</span>
        </div>

        <div className="final-cta-layout">
          <div className="final-cta-copy">
            <h2>
              {isId
                ? "Perkuat strategi pengelolaan kredit bersama Greatinco."
                : "Strengthen your credit management strategy with Greatinco."}
            </h2>
          </div>

          <div className="final-cta-side">
            <p>
              {isId
                ? "Diskusikan kebutuhan portofolio, operasional penagihan, strategi pemulihan, maupun kebutuhan tenaga collection bersama tim kami."
                : "Discuss your portfolio, collection operations, recovery strategy or collection workforce requirements with our team."}
            </p>

            <Link href={`/${locale}/contact`} className="final-cta-button">
              <span>{isId ? "Hubungi Tim Kami" : "Talk to Our Team"}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className="final-cta-bottom">
          <span>
            {isId
              ? "Manajemen Kredit • Recovery • Portfolio Solutions"
              : "Credit Management • Recovery • Portfolio Solutions"}
          </span>

          <span>Greatinco</span>
        </div>
      </div>
    </section>
  );
}

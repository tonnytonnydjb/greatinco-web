import Link from "next/link";
import type { HeroContent } from "@/types/cms";

type Props = {
  content: HeroContent;
};

export function Hero({ content }: Props) {
  return (
    <section className="hero">
      <div className="hero-grid gi-container">
        <div className="hero-content">
          {content.eyebrow && <div className="gi-eyebrow">{content.eyebrow}</div>}

          <h1 className="gi-display">{content.title}</h1>

          <p className="hero-description">{content.description}</p>

          <div className="hero-actions">
            {content.primaryCta && (
              <Link className="hero-primary" href={content.primaryCta.href}>
                {content.primaryCta.label}
              </Link>
            )}

            {content.secondaryCta && (
              <Link className="hero-secondary" href={content.secondaryCta.href}>
                {content.secondaryCta.label}
                <span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-visual-grid">
            <div className="hero-stat">
              <span>01</span>
              <strong>Strategy</strong>
            </div>
            <div className="hero-stat">
              <span>02</span>
              <strong>Servicing</strong>
            </div>
            <div className="hero-stat">
              <span>03</span>
              <strong>Recovery</strong>
            </div>
            <div className="hero-stat">
              <span>04</span>
              <strong>Analytics</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";

import type { SolutionDetail } from "@/services/solutions";
import type { SiteLocale } from "@/types/cms";

type Props = {
  locale: SiteLocale;
  solution: SolutionDetail;
};

export function SolutionDetailPage({ locale, solution }: Props) {
  const isId = locale === "id";

  return (
    <main className="solution-detail-v2">
      <section className="solution-detail-v2-hero">
        <div className="gi-container solution-detail-v2-hero-grid">
          <div className="solution-detail-v2-copy">
            <div className="gi-eyebrow">{isId ? "SOLUSI GREATINCO" : "GREATINCO SOLUTION"}</div>

            <h1>{solution.heroTitle}</h1>

            {solution.heroDescription && <p>{solution.heroDescription}</p>}

            <div className="solution-detail-v2-actions">
              <Link href={`/${locale}/contact`} className="solution-detail-v2-primary">
                {isId ? "Diskusikan kebutuhan Anda" : "Discuss your requirements"}
                <span aria-hidden="true">↗</span>
              </Link>

              <Link href={`/${locale}/solutions`} className="solution-detail-v2-secondary">
                {isId ? "Semua solusi" : "All solutions"}
              </Link>
            </div>
          </div>

          <aside className="solution-detail-v2-aside">
            <span>{isId ? "KAPABILITAS" : "CAPABILITY"}</span>

            <strong>{solution.title}</strong>

            <div>
              <span>{isId ? "MODEL DELIVERY" : "DELIVERY MODEL"}</span>
              <p>
                {isId
                  ? "People, process, technology, dan governance dalam satu operating model."
                  : "People, process, technology and governance within one operating model."}
              </p>
            </div>
          </aside>
        </div>

        {solution.heroImage?.src && (
          <div className="gi-container solution-detail-v2-image-wrap">
            <div className="solution-detail-v2-image">
              <Image
                src={solution.heroImage.src}
                alt={solution.heroImage.alt}
                fill
                priority
                sizes="100vw"
              />
            </div>
          </div>
        )}
      </section>

      <section className="solution-detail-v2-body">
        <div className="gi-container solution-detail-v2-body-grid">
          <aside className="solution-detail-v2-body-aside">
            <span>{isId ? "TENTANG SOLUSI" : "ABOUT THE SOLUTION"}</span>

            <strong>{solution.title}</strong>
          </aside>

          <div className="solution-detail-v2-content">
            {solution.shortDescription && (
              <p className="solution-detail-v2-lead">{solution.shortDescription}</p>
            )}

            {solution.content.length > 0 ? (
              solution.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p>
                {isId
                  ? "Informasi lebih lengkap mengenai solusi ini dapat didiskusikan bersama tim Greatinco."
                  : "Further information about this solution can be discussed with the Greatinco team."}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="solution-detail-v2-framework">
        <div className="gi-container">
          <header>
            <div className="gi-eyebrow">
              {isId ? "PENDEKATAN OPERASIONAL" : "OPERATING APPROACH"}
            </div>

            <h2>
              {isId
                ? "Dibangun untuk eksekusi yang konsisten dan hasil yang dapat diukur."
                : "Built for consistent execution and measurable outcomes."}
            </h2>
          </header>

          <div className="solution-detail-v2-framework-grid">
            {[
              {
                number: "01",
                title: isId ? "Assessment" : "Assessment",
                text: isId
                  ? "Memahami karakteristik portofolio, objective, dan tantangan operasional."
                  : "Understand portfolio characteristics, objectives and operational challenges.",
              },
              {
                number: "02",
                title: isId ? "Design" : "Design",
                text: isId
                  ? "Menyusun operating model, workflow, dan pengukuran kinerja."
                  : "Define operating model, workflows and performance measurement.",
              },
              {
                number: "03",
                title: isId ? "Execution" : "Execution",
                text: isId
                  ? "Menjalankan operasi dengan standar kualitas dan tata kelola yang jelas."
                  : "Execute with clear quality standards and governance.",
              },
              {
                number: "04",
                title: isId ? "Optimization" : "Optimization",
                text: isId
                  ? "Mengoptimalkan hasil melalui monitoring dan continuous improvement."
                  : "Improve outcomes through monitoring and continuous improvement.",
              },
            ].map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="solution-detail-v2-cta">
        <div className="gi-container solution-detail-v2-cta-inner">
          <div>
            <div className="gi-eyebrow">{isId ? "LANGKAH BERIKUTNYA" : "NEXT STEP"}</div>

            <h2>
              {isId
                ? "Mari diskusikan kebutuhan portofolio Anda."
                : "Let's discuss your portfolio requirements."}
            </h2>
          </div>

          <Link href={`/${locale}/contact`}>
            {isId ? "Hubungi tim kami" : "Talk to our team"}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

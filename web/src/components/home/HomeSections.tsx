import Link from "next/link";
import type { HomepageSectionContent, SolutionContent } from "@/types/cms";

type Props = {
  locale: "id" | "en";
  capabilities: HomepageSectionContent;
  solutionsSection: HomepageSectionContent;
  solutions: SolutionContent[];
};

export function HomeSections({ locale, capabilities, solutionsSection, solutions }: Props) {
  const isId = locale === "id";

  const capabilityItems = isId
    ? [
        {
          number: "01",
          title: "Kemitraan Institusi Keuangan",
          value: "15+",
          description:
            "Dipercaya oleh bank, perusahaan pembiayaan, fintech, perusahaan asuransi, dan institusi keuangan lainnya.",
        },
        {
          number: "02",
          title: "Cakupan Operasional",
          value: "Nasional",
          description:
            "Kapabilitas desk collection dan field collection untuk mendukung kebutuhan operasional di berbagai wilayah Indonesia.",
        },
        {
          number: "03",
          title: "Pengelolaan Kredit",
          value: "Menyeluruh",
          description:
            "Mulai dari strategi portofolio dan segmentasi hingga servicing, penagihan, dan pemulihan.",
        },
        {
          number: "04",
          title: "Model Operasional",
          value: "Berbasis Teknologi",
          description:
            "Operasi berbasis data, analitik, quality monitoring, dan tata kelola yang terukur.",
        },
      ]
    : [
        {
          number: "01",
          title: "Financial Institution Partnerships",
          value: "15+",
          description:
            "Trusted by banks, multifinance companies, fintechs, insurers and other financial institutions.",
        },
        {
          number: "02",
          title: "Operational Coverage",
          value: "Nationwide",
          description:
            "Desk and field collection capabilities supporting operations across Indonesia.",
        },
        {
          number: "03",
          title: "Credit Management",
          value: "End-to-End",
          description:
            "From portfolio strategy and segmentation to servicing, collection and recovery.",
        },
        {
          number: "04",
          title: "Operating Model",
          value: "Technology-Enabled",
          description:
            "Data-driven operations supported by analytics, quality monitoring and governance.",
        },
      ];

  const operatingModel = isId
    ? [
        "Strategi Portofolio",
        "Segmentasi",
        "Engagement Nasabah",
        "Desk Collection",
        "Field Collection",
        "Pemulihan",
        "Analitik & Optimalisasi",
      ]
    : [
        "Portfolio Strategy",
        "Segmentation",
        "Customer Engagement",
        "Desk Collection",
        "Field Collection",
        "Recovery",
        "Analytics & Optimization",
      ];

  return (
    <>
      <section className="enterprise-proof">
        <div className="gi-container enterprise-proof-header">
          <div className="gi-eyebrow">{capabilities.eyebrow}</div>

          <div className="enterprise-proof-copy">
            <h2>{capabilities.title}</h2>
            <p>{capabilities.description}</p>
          </div>
        </div>

        <div className="gi-container enterprise-proof-list">
          {capabilityItems.map((item) => (
            <article className="enterprise-proof-item" key={item.number}>
              <span className="enterprise-proof-number">{item.number}</span>

              <div className="enterprise-proof-main">
                <span>{item.title}</span>
                <strong>{item.value}</strong>
              </div>

              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      {solutions.length > 0 && (
        <section className="solutions-enterprise">
          <div className="gi-container solutions-enterprise-header">
            <div>
              <div className="gi-eyebrow">{solutionsSection.eyebrow}</div>

              <h2 className="gi-heading">{solutionsSection.title}</h2>
            </div>

            <p>{solutionsSection.description}</p>
          </div>

          <div className="gi-container solutions-enterprise-list">
            {solutions.map((solution, index) => (
              <Link href={solution.href} className="solutions-enterprise-item" key={solution.id}>
                <span className="solutions-enterprise-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3>{solution.title}</h3>

                <p>{solution.description}</p>

                <span className="solutions-enterprise-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="operating-model-section">
        <div className="gi-container operating-model-layout">
          <div className="operating-model-intro">
            <div className="gi-eyebrow">{isId ? "Model Operasional" : "Operating Model"}</div>

            <h2>
              {isId
                ? "Satu alur terintegrasi dari strategi hingga pemulihan."
                : "One integrated operating flow from strategy to recovery."}
            </h2>

            <p>
              {isId
                ? "Greatinco mengelola proses secara menyeluruh dengan fokus pada efektivitas, konsistensi, dan pengambilan keputusan berbasis data."
                : "Greatinco manages the lifecycle end-to-end with a focus on effectiveness, consistency and data-driven decision making."}
            </p>
          </div>

          <div className="operating-model-flow">
            {operatingModel.map((item, index) => (
              <div className="operating-model-step" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>

                <strong>{item}</strong>

                {index < operatingModel.length - 1 && (
                  <div className="operating-model-line" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

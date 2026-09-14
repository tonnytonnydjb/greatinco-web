import Link from "next/link";

import { LeadershipSection } from "@/components/leadership/LeadershipSection";
import type { CompanyPageContent } from "@/services/company";
import { getLeadershipMembers } from "@/services/leadership";
import type { SiteLocale } from "@/types/cms";

import styles from "./CompanyPage.module.css";

type Props = {
  locale: SiteLocale;
  page: CompanyPageContent;
  pages: CompanyPageContent[];
};

function companyHref(locale: SiteLocale, slug: string) {
  return slug === "company" ? `/${locale}/company` : `/${locale}/company/${slug}`;
}

function paragraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function navLabel(locale: SiteLocale, slug: string) {
  const isId = locale === "id";

  const labels: Record<string, { id: string; en: string }> = {
    company: {
      id: "Tentang Kami",
      en: "About",
    },
    leadership: {
      id: "Kepemimpinan",
      en: "Leadership",
    },
    organization: {
      id: "Organisasi",
      en: "Organization",
    },
    governance: {
      id: "Tata Kelola",
      en: "Governance",
    },
  };

  return labels[slug]?.[isId ? "id" : "en"] ?? slug;
}

export async function CompanyPage({ locale, page, pages }: Props) {
  const isId = locale === "id";

  const leadershipMembers = page.slug === "leadership" ? await getLeadershipMembers(locale) : [];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.shell}>
          <div className={styles.heroGrid}>
            <div className={styles.heroPrimary}>
              {page.eyebrow ? <div className={styles.eyebrow}>{page.eyebrow}</div> : null}

              <h1>{page.heroTitle}</h1>

              <p className={styles.heroDescription}>
                {page.heroDescription ||
                  (isId
                    ? "Kapabilitas terintegrasi untuk mendukung pengelolaan kredit dan portofolio secara disiplin, terukur, dan berkelanjutan."
                    : "Integrated capabilities supporting disciplined, measurable and sustainable credit and portfolio management.")}
              </p>
            </div>

            <div className={styles.heroCapabilities}>
              <div className={styles.capabilityRow}>
                <span>01</span>
                <strong>Credit Management</strong>
              </div>

              <div className={styles.capabilityRow}>
                <span>02</span>
                <strong>Portfolio Servicing</strong>
              </div>

              <div className={styles.capabilityRow}>
                <span>03</span>
                <strong>Collection Operations</strong>
              </div>

              <div className={styles.capabilityRow}>
                <span>04</span>
                <strong>Recovery & Governance</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav
        className={styles.companyNav}
        aria-label={isId ? "Navigasi perusahaan" : "Company navigation"}
      >
        <div className={styles.shell}>
          <div className={styles.companyNavInner}>
            {pages.map((item, index) => {
              const active = item.slug === page.slug;

              return (
                <Link
                  key={item.id}
                  href={companyHref(locale, item.slug)}
                  className={active ? styles.navItemActive : styles.navItem}
                >
                  <span className={styles.navIndex}>{String(index + 1).padStart(2, "0")}</span>

                  <span>{navLabel(locale, item.slug)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <section className={styles.introSection}>
        <div className={styles.shell}>
          <div className={styles.introContent}>
            <span className={styles.introEyebrow}>
              {isId ? "Perspektif Perusahaan" : "Corporate Perspective"}
            </span>

            <h2>
              {page.intro ||
                (isId
                  ? "Membangun kapabilitas yang menghubungkan strategi, kontrol, dan eksekusi."
                  : "Building capabilities that connect strategy, control and execution.")}
            </h2>
          </div>

          <div className={styles.editorialContent}>
            {paragraphs(page.content).map((paragraph, index) => (
              <p key={`${page.slug}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {page.slug === "leadership" ? (
        <LeadershipSection locale={locale} members={leadershipMembers} />
      ) : null}

      <section className={styles.operatingSection}>
        <div className={styles.shell}>
          <div className={styles.operatingHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                {isId ? "Cara Kami Beroperasi" : "How We Operate"}
              </span>

              <h2>
                {isId
                  ? "Disiplin operasional yang dibangun untuk skala dan kontrol."
                  : "Operational discipline designed for scale and control."}
              </h2>

              <p>
                {isId
                  ? "Struktur kerja yang menghubungkan strategi portofolio, eksekusi operasional, teknologi, quality dan governance."
                  : "An operating structure connecting portfolio strategy, operational execution, technology, quality and governance."}
              </p>
            </div>
          </div>

          <div className={styles.operatingRows}>
            <article className={styles.operatingRow}>
              <span className={styles.rowNumber}>01</span>

              <div className={styles.rowTitle}>{isId ? "Strategi" : "Strategy"}</div>

              <div className={styles.rowDescription}>
                {isId
                  ? "Pengambilan keputusan berbasis karakteristik portofolio, tujuan klien, data, dan prioritas bisnis."
                  : "Portfolio-led decision making aligned with client objectives, data and business priorities."}
              </div>
            </article>

            <article className={styles.operatingRow}>
              <span className={styles.rowNumber}>02</span>

              <div className={styles.rowTitle}>{isId ? "Eksekusi" : "Execution"}</div>

              <div className={styles.rowDescription}>
                {isId
                  ? "Desk dan field operations yang terukur, konsisten, dan terhubung dengan performance management."
                  : "Disciplined desk and field operations connected to measurable performance management."}
              </div>
            </article>

            <article className={styles.operatingRow}>
              <span className={styles.rowNumber}>03</span>

              <div className={styles.rowTitle}>
                {isId ? "Teknologi & Data" : "Technology & Data"}
              </div>

              <div className={styles.rowDescription}>
                {isId
                  ? "Workflow, analytics, visibility, dan data yang mendukung keputusan serta kontrol operasional."
                  : "Workflow, analytics and operational visibility supporting decisions and control."}
              </div>
            </article>

            <article className={styles.operatingRow}>
              <span className={styles.rowNumber}>04</span>

              <div className={styles.rowTitle}>{isId ? "Governance" : "Governance"}</div>

              <div className={styles.rowDescription}>
                {isId
                  ? "Quality assurance, risk, compliance, security, dan auditability sebagai bagian dari operating model."
                  : "Quality assurance, risk, compliance, security and auditability embedded in the operating model."}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.capabilitySection}>
        <div className={styles.shell}>
          <div className={styles.capabilityGrid}>
            <div className={styles.capabilityIntro}>
              <span className={styles.sectionEyebrow}>
                {isId ? "Kapabilitas Inti" : "Core Capabilities"}
              </span>

              <h2>
                {isId
                  ? "Dibangun untuk lingkungan operasional dengan tuntutan tinggi."
                  : "Built for demanding operational environments."}
              </h2>
            </div>

            <div className={styles.capabilityList}>
              <div>
                <span>01</span>
                <strong>Credit Management</strong>
              </div>

              <div>
                <span>02</span>
                <strong>Portfolio Servicing</strong>
              </div>

              <div>
                <span>03</span>
                <strong>Collection Operations</strong>
              </div>

              <div>
                <span>04</span>
                <strong>Recovery</strong>
              </div>

              <div>
                <span>05</span>
                <strong>Analytics & Monitoring</strong>
              </div>

              <div>
                <span>06</span>
                <strong>Governance & Quality</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.shell}>
          <div className={styles.ctaInner}>
            <span className={styles.sectionEyebrow}>
              {isId ? "Bekerja Bersama Greatinco" : "Work With Greatinco"}
            </span>

            <h2>
              {isId
                ? "Siap membahas kebutuhan pengelolaan kredit dan portofolio Anda."
                : "Ready to discuss your credit and portfolio management needs."}
            </h2>

            <p>
              {isId
                ? "Bicarakan karakteristik portofolio, target bisnis, dan kebutuhan operasional Anda bersama tim Greatinco."
                : "Discuss your portfolio characteristics, business objectives and operational requirements with the Greatinco team."}
            </p>

            <Link href={`/${locale}/contact`} className={styles.ctaButton}>
              <span>{isId ? "Hubungi Kami" : "Contact Us"}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

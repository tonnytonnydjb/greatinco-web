import Image from "next/image";
import Link from "next/link";
import type { SiteLocale } from "@/config/site";

export function SiteFooter({ locale }: { locale: SiteLocale }) {
  const isId = locale === "id";

  return (
    <footer className="site-footer">
      <div className="gi-container footer-main">
        <div className="footer-intro">
          <Image
            src="/brand/greatinco-logo-white.png"
            alt="Greatinco"
            width={210}
            height={46}
            className="footer-logo"
          />

          <p>
            {isId
              ? "Solusi manajemen kredit, penagihan, pemulihan, dan pengelolaan portofolio bagi institusi keuangan."
              : "Credit management, collection, recovery and portfolio solutions for financial institutions."}
          </p>
        </div>

        <div className="footer-column">
          <div className="footer-label">{isId ? "Perusahaan" : "Company"}</div>

          <Link href={`/${locale}/company`}>{isId ? "Tentang Greatinco" : "About Greatinco"}</Link>

          <Link href={`/${locale}/company/leadership`}>
            {isId ? "Tim & Kepemimpinan" : "Leadership"}
          </Link>

          <Link href={`/${locale}/careers`}>{isId ? "Karier" : "Careers"}</Link>
        </div>

        <div className="footer-column">
          <div className="footer-label">{isId ? "Solusi" : "Solutions"}</div>

          <Link href={`/${locale}/solutions/credit-servicing-recovery`}>Credit Servicing</Link>

          <Link href={`/${locale}/solutions/desk-collection`}>Desk Collection</Link>

          <Link href={`/${locale}/solutions/field-collection`}>Field Collection</Link>

          <Link href={`/${locale}/solutions/portfolio-strategy-investment`}>
            Portfolio Strategy
          </Link>
        </div>

        <div className="footer-column">
          <div className="footer-label">{isId ? "Informasi" : "Information"}</div>

          <span>Jakarta, Indonesia</span>

          <Link href={`/${locale}/contact`}>{isId ? "Hubungi Kami" : "Contact Us"}</Link>

          <Link href={`/${locale}/privacy`}>{isId ? "Kebijakan Privasi" : "Privacy Policy"}</Link>

          <Link href={`/${locale}/terms`}>{isId ? "Ketentuan Layanan" : "Terms of Service"}</Link>
        </div>
      </div>

      <div className="gi-container footer-bottom">
        <span>
          © {new Date().getFullYear()} Greatinco.{" "}
          {isId ? "Seluruh hak dilindungi." : "All rights reserved."}
        </span>

        <div className="footer-locale">
          <Link href="/id">ID</Link>
          <span>/</span>
          <Link href="/en">EN</Link>
        </div>
      </div>
    </footer>
  );
}

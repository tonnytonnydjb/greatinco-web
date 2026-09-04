import type { SiteLocale } from "@/config/site";

export function SiteFooter({ locale }: { locale: SiteLocale }) {
  const isId = locale === "id";

  return (
    <footer className="site-footer">
      <div className="gi-container footer-grid">
        <div>
          <div className="footer-brand">GREATINCO</div>
          <p>
            {isId
              ? "Credit management, servicing, recovery dan portfolio solutions untuk institusi keuangan."
              : "Credit management, servicing, recovery and portfolio solutions for financial institutions."}
          </p>
        </div>

        <div>
          <div className="footer-label">{isId ? "Perusahaan" : "Company"}</div>
          <span>Greatinco</span>
          <span>Jakarta, Indonesia</span>
        </div>

        <div>
          <div className="footer-label">{isId ? "Legal" : "Legal"}</div>
          <span>{isId ? "Kebijakan Privasi" : "Privacy Policy"}</span>
          <span>{isId ? "Ketentuan Layanan" : "Terms of Service"}</span>
        </div>
      </div>

      <div className="gi-container footer-bottom">
        © {new Date().getFullYear()} Greatinco. All rights reserved.
      </div>
    </footer>
  );
}

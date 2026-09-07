import Image from "next/image";
import Link from "next/link";

import type { NavigationItem, SiteLocale, SiteSettingsContent } from "@/types/cms";

type Props = {
  locale: SiteLocale;
  navigation: NavigationItem[];
  settings: SiteSettingsContent;
};

function linkProps(item: NavigationItem) {
  if (!item.openInNewTab) {
    return {};
  }

  return {
    target: "_blank",
    rel: "noopener noreferrer",
  };
}

export function SiteFooter({ locale, navigation, settings }: Props) {
  const isId = locale === "id";

  return (
    <footer className="site-footer">
      <div className="gi-container footer-main">
        <div className="footer-intro">
          <Image
            src={settings.logoLight?.src ?? "/brand/greatinco-logo-white.png"}
            alt={settings.logoLight?.alt ?? settings.siteName}
            width={210}
            height={46}
            className="footer-logo"
          />

          <p>{settings.footerDescription}</p>

          {settings.contactEmail && (
            <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
          )}

          {settings.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}
        </div>

        {navigation.map((item) => (
          <div className="footer-column" key={item.id}>
            <div className="footer-label">{item.label}</div>

            {item.children.length > 0 ? (
              item.children.map((child) => (
                <Link href={child.href} key={child.id} {...linkProps(child)}>
                  {child.label}
                </Link>
              ))
            ) : (
              <Link href={item.href} {...linkProps(item)}>
                {item.label}
              </Link>
            )}
          </div>
        ))}

        {navigation.length === 0 && (
          <div className="footer-column">
            <div className="footer-label">{isId ? "Informasi" : "Information"}</div>

            {settings.officeAddress && <span>{settings.officeAddress}</span>}

            <Link href={`/${locale}/contact`}>{isId ? "Hubungi Kami" : "Contact Us"}</Link>
          </div>
        )}
      </div>

      <div className="gi-container footer-bottom">
        <span>
          © {new Date().getFullYear()} {settings.legalName || settings.siteName}.{" "}
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

"use client";

import Link from "next/link";
import { useState } from "react";
import type { SiteLocale } from "@/config/site";
import { siteConfig } from "@/config/site";

type Props = {
  locale: SiteLocale;
};

export function SiteHeader({ locale }: Props) {
  const [open, setOpen] = useState(false);

  const navigation = siteConfig.navigation[locale];
  const alternateLocale = locale === "id" ? "en" : "id";

  return (
    <header className="site-header">
      <div className="gi-container header-inner">
        <Link href={`/${locale}`} className="brand" aria-label="Greatinco home">
          <span className="brand-mark">G</span>
          <span className="brand-name">GREATINCO</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="language" href={`/${alternateLocale}`}>
            {alternateLocale.toUpperCase()}
          </Link>

          <Link className="header-cta" href={`/${locale}/contact`}>
            {locale === "id" ? "Hubungi Kami" : "Contact Us"}
          </Link>

          <button
            type="button"
            className="menu-button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu">
          <div className="gi-container mobile-menu-inner">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}

            <Link href={`/${alternateLocale}`} onClick={() => setOpen(false)}>
              {alternateLocale === "id" ? "Bahasa Indonesia" : "English"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

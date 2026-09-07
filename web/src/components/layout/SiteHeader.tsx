"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { SiteLocale } from "@/config/site";
import { siteConfig } from "@/config/site";

type Props = {
  locale: SiteLocale;
};

export function SiteHeader({ locale }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  const navigation = siteConfig.navigation[locale];
  const alternateLocale = locale === "id" ? "en" : "id";

  return (
    <header className="site-header">
      <div className="gi-container header-inner">
        <Link href={`/${locale}`} className="brand" aria-label="Greatinco home">
          <Image
            src="/brand/greatinco-logo-white.png"
            alt="Greatinco"
            width={220}
            height={48}
            priority
            className="brand-logo"
          />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <div className="nav-item" key={item.href}>
              <Link href={item.href} className="nav-link">
                {item.label}

                {"children" in item && item.children && (
                  <span className="nav-chevron" aria-hidden="true">
                    ↓
                  </span>
                )}
              </Link>

              {"children" in item && item.children && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-inner">
                    <div className="nav-dropdown-heading">
                      <span>{locale === "id" ? "Jelajahi" : "Explore"}</span>
                      <strong>{item.label}</strong>
                    </div>

                    <div className="nav-dropdown-links">
                      {item.children.map((child) => (
                        <Link href={child.href} key={child.href}>
                          <span>{child.label}</span>
                          <span aria-hidden="true">↗</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          <div className="gi-container mobile-menu-inner">
            {navigation.map((item) => {
              const hasChildren = "children" in item && item.children;

              if (!hasChildren) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="mobile-nav-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              }

              const expanded = mobileSection === item.href;

              return (
                <div className="mobile-nav-group" key={item.href}>
                  <button
                    type="button"
                    className="mobile-nav-trigger"
                    aria-expanded={expanded}
                    onClick={() => setMobileSection(expanded ? null : item.href)}
                  >
                    <span>{item.label}</span>
                    <span>{expanded ? "−" : "+"}</span>
                  </button>

                  {expanded && (
                    <div className="mobile-subnav">
                      {item.children.map((child) => (
                        <Link
                          href={child.href}
                          key={child.href}
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href={`/${alternateLocale}`}
              className="mobile-language"
              onClick={() => setMobileOpen(false)}
            >
              {alternateLocale === "id" ? "Bahasa Indonesia" : "English"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

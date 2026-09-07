"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

export function SiteHeader({ locale, navigation, settings }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [mobileSection, setMobileSection] = useState<number | null>(null);

  const alternateLocale = locale === "id" ? "en" : "id";

  return (
    <header className="site-header">
      <div className="gi-container header-inner">
        <Link href={`/${locale}`} className="brand" aria-label={`${settings.siteName} home`}>
          <Image
            src={settings.logoLight?.src ?? "/brand/greatinco-logo-white.png"}
            alt={settings.logoLight?.alt ?? settings.siteName}
            width={220}
            height={48}
            priority
            className="brand-logo"
          />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <div className="nav-item" key={item.id}>
              <Link href={item.href} className="nav-link" {...linkProps(item)}>
                {item.label}

                {item.children.length > 0 && (
                  <span className="nav-chevron" aria-hidden="true">
                    ↓
                  </span>
                )}
              </Link>

              {item.children.length > 0 && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-inner">
                    <div className="nav-dropdown-heading">
                      <span>{locale === "id" ? "Jelajahi" : "Explore"}</span>

                      <strong>{item.label}</strong>
                    </div>

                    <div className="nav-dropdown-links">
                      {item.children.map((child) => (
                        <Link href={child.href} key={child.id} {...linkProps(child)}>
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
              const hasChildren = item.children.length > 0;

              if (!hasChildren) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="mobile-nav-link"
                    onClick={() => setMobileOpen(false)}
                    {...linkProps(item)}
                  >
                    {item.label}
                  </Link>
                );
              }

              const expanded = mobileSection === item.id;

              return (
                <div className="mobile-nav-group" key={item.id}>
                  <button
                    type="button"
                    className="mobile-nav-trigger"
                    aria-expanded={expanded}
                    onClick={() => setMobileSection(expanded ? null : item.id)}
                  >
                    <span>{item.label}</span>
                    <span>{expanded ? "−" : "+"}</span>
                  </button>

                  {expanded && (
                    <div className="mobile-subnav">
                      {item.children.map((child) => (
                        <Link
                          href={child.href}
                          key={child.id}
                          onClick={() => setMobileOpen(false)}
                          {...linkProps(child)}
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

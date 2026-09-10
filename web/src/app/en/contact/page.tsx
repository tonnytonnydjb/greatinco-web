import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteChromeContent } from "@/services/cms";

export const metadata: Metadata = {
  title: "Contact | Greatinco",
  description:
    "Contact Greatinco to discuss credit management, collection, recovery, portfolio servicing, and operational solutions.",
};

export default async function ContactPage() {
  const chrome = await getSiteChromeContent("en");

  return (
    <>
      <SiteHeader locale="en" navigation={chrome.headerNavigation} settings={chrome.settings} />

      <main>
        <section className="contact-page-hero">
          <div className="gi-container contact-page-grid">
            <div>
              <div className="gi-eyebrow">CONTACT GREATINCO</div>

              <h1>Let&apos;s discuss your credit management needs.</h1>

              <p>
                Share your requirements, questions, or collaboration opportunities with Greatinco.
              </p>
            </div>

            <ContactForm locale="en" />
          </div>
        </section>
      </main>

      <SiteFooter locale="en" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

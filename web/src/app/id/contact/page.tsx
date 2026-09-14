import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteChromeContent } from "@/services/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kontak | Greatinco",
  description:
    "Hubungi Greatinco untuk kebutuhan credit management, collection, recovery, portfolio servicing, dan solusi operasional lainnya.",
};

export default async function ContactPage() {
  const chrome = await getSiteChromeContent("id");

  return (
    <>
      <SiteHeader locale="id" navigation={chrome.headerNavigation} settings={chrome.settings} />

      <main>
        <section className="contact-page-hero">
          <div className="gi-container contact-page-grid">
            <div>
              <div className="gi-eyebrow">HUBUNGI GREATINCO</div>

              <h1>Mari diskusikan kebutuhan pengelolaan kredit Anda.</h1>

              <p>Sampaikan kebutuhan, pertanyaan, atau peluang kolaborasi kepada tim Greatinco.</p>
            </div>

            <ContactForm locale="id" />
          </div>
        </section>
      </main>

      <SiteFooter locale="id" navigation={chrome.footerNavigation} settings={chrome.settings} />
    </>
  );
}

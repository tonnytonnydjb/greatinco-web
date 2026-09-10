"use client";

import { FormEvent, useState } from "react";

import { getRecaptchaToken } from "@/lib/recaptcha-client";
import type { SiteLocale } from "@/types/cms";

type Props = {
  locale: SiteLocale;
};

export function ContactForm({ locale }: Props) {
  const isId = locale === "id";

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);

    data.set("locale", locale);
    data.set("consent", data.get("consent") ? "true" : "false");

    setSubmitting(true);
    setMessage("");

    try {
      const recaptchaToken = await getRecaptchaToken("contact_submit");

      data.set("recaptchaToken", recaptchaToken);

      const response = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });

      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.message || (isId ? "Pesan gagal dikirim." : "Unable to send message."),
        );
      }

      setSuccess(true);
      setMessage(result.message || "");
      form.reset();
    } catch (error) {
      setSuccess(false);

      setMessage(
        error instanceof Error
          ? error.message
          : isId
            ? "Pesan gagal dikirim."
            : "Unable to send message.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="contact-form-shell">
      {success ? (
        <div className="contact-success" role="status">
          <strong>{isId ? "Pesan diterima." : "Message received."}</strong>
          <p>{message}</p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-honeypot" aria-hidden="true">
            <label>
              Website
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="contact-form-grid">
            <label>
              <span>{isId ? "Nama Lengkap" : "Full Name"}*</span>
              <input name="fullName" type="text" maxLength={150} required autoComplete="name" />
            </label>

            <label>
              <span>Email *</span>
              <input name="email" type="email" maxLength={254} required autoComplete="email" />
            </label>

            <label>
              <span>{isId ? "Nomor Telepon" : "Phone Number"}</span>
              <input name="phone" type="tel" maxLength={40} autoComplete="tel" />
            </label>

            <label>
              <span>{isId ? "Perusahaan" : "Company"}</span>
              <input name="company" type="text" maxLength={180} autoComplete="organization" />
            </label>
          </div>

          <label>
            <span>{isId ? "Subjek" : "Subject"}*</span>
            <input name="subject" type="text" maxLength={180} required />
          </label>

          <label>
            <span>{isId ? "Pesan" : "Message"}*</span>
            <textarea name="message" rows={8} maxLength={5000} required />
          </label>

          <label className="contact-consent">
            <input name="consent" type="checkbox" required />

            <span>
              {isId
                ? "Saya menyetujui Greatinco memproses data yang saya kirimkan untuk menindaklanjuti pertanyaan ini."
                : "I consent to Greatinco processing the information I submit to respond to this inquiry."}
            </span>
          </label>

          {message && (
            <p className="contact-error" role="alert">
              {message}
            </p>
          )}

          <button type="submit" disabled={submitting}>
            {submitting
              ? isId
                ? "Mengirim..."
                : "Sending..."
              : isId
                ? "Kirim Pesan"
                : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}

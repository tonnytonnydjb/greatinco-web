"use client";

import { FormEvent, useState } from "react";

import { getRecaptchaToken } from "@/lib/recaptcha-client";
import type { SiteLocale } from "@/types/cms";

type Props = {
  locale: SiteLocale;
  vacancySlug: string;
  vacancyTitle: string;
};

export function CareerApplicationForm({ locale, vacancySlug, vacancyTitle }: Props) {
  const isId = locale === "id";

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.set("locale", locale);
    formData.set("vacancySlug", vacancySlug);
    formData.set("consent", formData.get("consent") ? "true" : "false");

    try {
      const recaptchaToken = await getRecaptchaToken("career_apply");

      formData.set("recaptchaToken", recaptchaToken);

      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.message ||
            (isId ? "Lamaran gagal dikirim." : "Application could not be submitted."),
        );
      }

      setSuccess(true);

      setMessage(
        result.message ||
          (isId ? "Lamaran berhasil dikirim." : "Application submitted successfully."),
      );

      form.reset();
    } catch (error) {
      setSuccess(false);

      setMessage(
        error instanceof Error
          ? error.message
          : isId
            ? "Lamaran gagal dikirim."
            : "Application could not be submitted.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="apply" className="career-application">
      <div className="career-application-heading">
        <span>{isId ? "LAMAR POSISI" : "APPLY NOW"}</span>

        <h2>{isId ? "Tertarik bergabung?" : "Interested in joining us?"}</h2>

        <p>
          {isId
            ? `Kirim lamaran Anda untuk posisi ${vacancyTitle}.`
            : `Submit your application for ${vacancyTitle}.`}
        </p>
      </div>

      {success ? (
        <div className="career-form-success" role="status">
          <strong>{isId ? "Lamaran diterima." : "Application received."}</strong>
          <p>{message}</p>
        </div>
      ) : (
        <form
          className="career-application-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="career-honeypot" aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="career-form-grid">
            <label>
              <span>{isId ? "Nama Lengkap" : "Full Name"}*</span>
              <input name="fullName" type="text" required maxLength={150} autoComplete="name" />
            </label>

            <label>
              <span>Email *</span>
              <input name="email" type="email" required maxLength={254} autoComplete="email" />
            </label>

            <label>
              <span>{isId ? "Nomor Telepon" : "Phone Number"}*</span>
              <input name="phone" type="tel" required maxLength={40} autoComplete="tel" />
            </label>

            <label>
              <span>LinkedIn</span>
              <input
                name="linkedinUrl"
                type="url"
                maxLength={500}
                placeholder="https://linkedin.com/in/..."
              />
            </label>

            <label>
              <span>{isId ? "Perusahaan Saat Ini" : "Current Company"}</span>
              <input
                name="currentCompany"
                type="text"
                maxLength={150}
                autoComplete="organization"
              />
            </label>

            <label>
              <span>{isId ? "Posisi Saat Ini" : "Current Position"}</span>
              <input name="currentPosition" type="text" maxLength={150} />
            </label>
          </div>

          <label className="career-form-full">
            <span>{isId ? "Pesan / Cover Letter" : "Message / Cover Letter"}</span>
            <textarea name="coverLetter" rows={7} maxLength={5000} />
          </label>

          <label className="career-file-field">
            <span>CV / Resume *</span>

            <input
              name="cv"
              type="file"
              required
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />

            <small>PDF, DOC, DOCX · Max 5 MB</small>
          </label>

          <label className="career-consent">
            <input name="consent" type="checkbox" required />

            <span>
              {isId
                ? "Saya menyetujui Greatinco memproses data pribadi yang saya kirimkan untuk tujuan proses rekrutmen."
                : "I consent to Greatinco processing the personal information I submit for recruitment purposes."}
            </span>
          </label>

          {message && (
            <p className="career-form-error" role="alert">
              {message}
            </p>
          )}

          <button type="submit" disabled={submitting} className="career-submit-button">
            {submitting
              ? isId
                ? "Mengirim..."
                : "Submitting..."
              : isId
                ? "Kirim Lamaran"
                : "Submit Application"}
          </button>
        </form>
      )}
    </section>
  );
}

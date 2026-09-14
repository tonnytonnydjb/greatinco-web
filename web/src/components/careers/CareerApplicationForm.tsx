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
    <section id="apply" className="career-application-v2">
      <header className="career-application-v2-heading">
        <div>
          <span>{isId ? "LAMAR POSISI" : "APPLY FOR THIS ROLE"}</span>

          <h2>{isId ? "Mulai proses aplikasi Anda." : "Start your application."}</h2>
        </div>

        <p>
          {isId
            ? `Kirim profil Anda untuk posisi ${vacancyTitle}. Tim kami akan melakukan review terhadap setiap aplikasi yang masuk.`
            : `Submit your profile for ${vacancyTitle}. Our team will review each application received.`}
        </p>
      </header>

      {success ? (
        <div className="career-form-success-v2" role="status">
          <span aria-hidden="true">✓</span>

          <div>
            <strong>{isId ? "Lamaran diterima." : "Application received."}</strong>
            <p>{message}</p>
          </div>
        </div>
      ) : (
        <form
          className="career-application-form-v2"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="career-honeypot" aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="career-form-v2-section">
            <div className="career-form-v2-section-heading">
              <span>01</span>
              <strong>{isId ? "Informasi pribadi" : "Personal information"}</strong>
            </div>

            <div className="career-form-v2-grid">
              <label>
                <span>{isId ? "Nama Lengkap" : "Full Name"} *</span>
                <input name="fullName" type="text" required maxLength={150} autoComplete="name" />
              </label>

              <label>
                <span>Email *</span>
                <input name="email" type="email" required maxLength={254} autoComplete="email" />
              </label>

              <label>
                <span>{isId ? "Nomor Telepon" : "Phone Number"} *</span>
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
            </div>
          </div>

          <div className="career-form-v2-section">
            <div className="career-form-v2-section-heading">
              <span>02</span>
              <strong>{isId ? "Pengalaman profesional" : "Professional background"}</strong>
            </div>

            <div className="career-form-v2-grid">
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

            <label className="career-form-v2-full">
              <span>{isId ? "Pesan / Cover Letter" : "Message / Cover Letter"}</span>
              <textarea name="coverLetter" rows={7} maxLength={5000} />
            </label>
          </div>

          <div className="career-form-v2-section">
            <div className="career-form-v2-section-heading">
              <span>03</span>
              <strong>{isId ? "Dokumen" : "Documents"}</strong>
            </div>

            <label className="career-file-field-v2">
              <span>CV / Resume *</span>

              <input
                name="cv"
                type="file"
                required
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />

              <small>PDF, DOC, DOCX · Max 5 MB</small>
            </label>
          </div>

          <div className="career-form-v2-footer">
            <div className="career-form-v2-legal">
              <label className="career-consent-v2">
                <input name="consent" type="checkbox" required />

                <span>
                  {isId
                    ? "Saya menyetujui Greatinco memproses data pribadi yang saya kirimkan untuk tujuan proses rekrutmen."
                    : "I consent to Greatinco processing the personal information I submit for recruitment purposes."}
                </span>
              </label>

              <p className="career-form-v2-privacy-note">
                {isId
                  ? "Data yang dikirimkan hanya digunakan untuk proses evaluasi dan rekrutmen Greatinco."
                  : "Information submitted will only be used for Greatinco recruitment and evaluation purposes."}
              </p>

              {message && (
                <p className="career-form-error" role="alert">
                  {message}
                </p>
              )}
            </div>

            <div className="career-form-v2-submit">
              <span>{isId ? "SIAP MENGIRIM?" : "READY TO APPLY?"}</span>

              <button type="submit" disabled={submitting} className="career-submit-button-v2">
                <span>
                  {submitting
                    ? isId
                      ? "Mengirim..."
                      : "Submitting..."
                    : isId
                      ? "Kirim Lamaran"
                      : "Submit Application"}
                </span>

                <strong aria-hidden="true">↗</strong>
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}

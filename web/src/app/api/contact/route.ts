import { NextResponse } from "next/server";

import { directusRequest as directusHttpRequest } from "@/lib/directus-http";
import { sendContactNotification } from "@/services/contact-mail";
import { verifyRecaptcha } from "@/services/recaptcha";

export const runtime = "nodejs";

type DirectusResponse<T> = {
  data: T;
};

function cleanText(value: FormDataEntryValue | null, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function jsonError(message: string, status: number) {
  return NextResponse.json(
    {
      ok: false,
      message,
    },
    {
      status,
    },
  );
}

async function directusCreate(payload: Record<string, unknown>) {
  const token = process.env.DIRECTUS_CONTACT_TOKEN;

  if (!token) {
    throw new Error("Contact service configuration incomplete.");
  }

  const response = await directusHttpRequest("/items/contact_inquiries", token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();

  if (!response.ok) {
    console.error("Contact Directus create failed", {
      status: response.status,
      body: text.slice(0, 500),
    });

    throw new Error(`Directus create failed: ${response.status}`);
  }

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as DirectusResponse<unknown>;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.includes("multipart/form-data")) {
      return jsonError("Invalid request format.", 415);
    }

    const form = await request.formData();

    const website = cleanText(form.get("website"), 200);

    if (website) {
      return NextResponse.json({
        ok: true,
      });
    }

    const recaptchaToken = cleanText(form.get("recaptchaToken"), 4096);

    const recaptcha = await verifyRecaptcha({
      token: recaptchaToken,
      expectedAction: "contact_submit",
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    if (!recaptcha.ok) {
      console.warn("Contact reCAPTCHA rejected", {
        reason: recaptcha.reason,
        score: recaptcha.score,
      });

      return jsonError("Unable to verify request.", 403);
    }

    const locale = cleanText(form.get("locale"), 2) === "en" ? "en" : "id";

    const fullName = cleanText(form.get("fullName"), 150);

    const email = cleanText(form.get("email"), 254).toLowerCase();

    const phone = normalizePhone(cleanText(form.get("phone"), 40));

    const company = cleanText(form.get("company"), 180);

    const subject = cleanText(form.get("subject"), 180);

    const message = cleanText(form.get("message"), 5000);

    const consent = form.get("consent") === "true";

    if (fullName.length < 2) {
      return jsonError(
        locale === "id" ? "Nama lengkap wajib diisi." : "Full name is required.",
        400,
      );
    }

    if (!isValidEmail(email)) {
      return jsonError(
        locale === "id" ? "Alamat email tidak valid." : "Invalid email address.",
        400,
      );
    }

    if (phone && (phone.length < 8 || phone.length > 20)) {
      return jsonError(
        locale === "id" ? "Nomor telepon tidak valid." : "Invalid phone number.",
        400,
      );
    }

    if (subject.length < 3) {
      return jsonError(locale === "id" ? "Subjek wajib diisi." : "Subject is required.", 400);
    }

    if (message.length < 10) {
      return jsonError(locale === "id" ? "Pesan terlalu singkat." : "Message is too short.", 400);
    }

    if (!consent) {
      return jsonError(
        locale === "id"
          ? "Persetujuan pemrosesan data diperlukan."
          : "Data processing consent is required.",
        400,
      );
    }

    await directusCreate({
      full_name: fullName,
      email,
      phone: phone || null,
      company: company || null,
      subject,
      message,
      consent: true,
      status: "new",
      submitted_at: new Date().toISOString(),
    });

    try {
      await sendContactNotification({
        fullName,
        email,
        phone,
        company,
        subject,
        message,
      });
    } catch (mailError) {
      console.error("Contact notification email failed", mailError);
    }

    return NextResponse.json(
      {
        ok: true,
        message: locale === "id" ? "Pesan berhasil dikirim." : "Your message has been sent.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Contact form error", error);

    return jsonError("Unable to submit inquiry.", 500);
  }
}

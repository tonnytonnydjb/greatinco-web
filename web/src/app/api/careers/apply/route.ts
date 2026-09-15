import { NextResponse } from "next/server";

import { sendCareerApplicationNotification } from "@/services/m365-mail";
import { verifyRecaptcha } from "@/services/recaptcha";
import { directusRequest as directusHttpRequest } from "@/lib/directus-http";

export const runtime = "nodejs";

const MAX_CV_SIZE = 5 * 1024 * 1024;
const MAX_CAREER_REQUEST_SIZE = 6 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(["pdf", "doc", "docx"]);

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

type DirectusCreateResponse<T> = {
  data: T;
};

type VacancyTranslation = {
  languages_id: number;
  title: string | null;
};

type Vacancy = {
  id: number | string;
  slug: string;
  status: string;
  translations?: VacancyTranslation[];
};

type UploadedFile = {
  id: string;
};

type CareerApplication = {
  id: number | string;
};

function jsonError(message: string, status: number) {
  return noStoreJson(
    {
      ok: false,
      message,
    },
    status,
  );
}

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
  const normalized = value.replace(/[\s().-]/g, "");
  return /^\+?\d{8,15}$/.test(normalized) ? normalized : "";
}

function requestTooLarge(request: Request, maxBytes: number) {
  const value = request.headers.get("content-length");

  if (!value) {
    return false;
  }

  const length = Number(value);

  return Number.isFinite(length) && length > maxBytes;
}

function isValidLinkedInUrl(value: string) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      (url.hostname === "linkedin.com" ||
        url.hostname === "www.linkedin.com")
    );
  } catch {
    return false;
  }
}

function noStoreJson(
  body: Record<string, unknown>,
  status = 200,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function extensionOf(filename: string) {
  const parts = filename.toLowerCase().split(".");

  if (parts.length < 2) {
    return "";
  }

  return parts.at(-1) ?? "";
}

function hasPdfSignature(bytes: Uint8Array) {
  return (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  );
}

function hasZipSignature(bytes: Uint8Array) {
  return (
    bytes.length >= 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    ((bytes[2] === 0x03 && bytes[3] === 0x04) ||
      (bytes[2] === 0x05 && bytes[3] === 0x06) ||
      (bytes[2] === 0x07 && bytes[3] === 0x08))
  );
}

function hasOleSignature(bytes: Uint8Array) {
  const signature = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

  if (bytes.length < signature.length) {
    return false;
  }

  return signature.every((value, index) => bytes[index] === value);
}

function validateFileSignature(extension: string, bytes: Uint8Array) {
  if (extension === "pdf") {
    return hasPdfSignature(bytes);
  }

  if (extension === "docx") {
    return hasZipSignature(bytes);
  }

  if (extension === "doc") {
    return hasOleSignature(bytes);
  }

  return false;
}

async function directusRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = process.env.DIRECTUS_CAREERS_TOKEN;

  if (!token) {
    throw new Error("Career service configuration is incomplete.");
  }

  const response = await directusHttpRequest(path, token, {
    ...options,
    cache: "no-store",
  });

  const body = await response.text();

  let payload: unknown = null;

  if (body) {
    try {
      payload = JSON.parse(body);
    } catch {
      payload = body;
    }
  }

  if (!response.ok) {
    console.error("Career Directus request failed", {
      path,
      status: response.status,
    });

    throw new Error(`Directus request failed: ${response.status}`);
  }

  return payload as T;
}

async function findPublishedVacancy(slug: string) {
  const result = await directusRequest<DirectusCreateResponse<Vacancy[]>>(
    `/items/vacancies?fields=id,slug,status,translations.languages_id,translations.title&filter[slug][_eq]=${encodeURIComponent(
      slug,
    )}&filter[status][_eq]=published&limit=1`,
  );

  return result.data?.[0] ?? null;
}

function vacancyTitleForLocale(vacancy: Vacancy, locale: "id" | "en") {
  const languageId = locale === "id" ? 1 : 2;

  return (
    vacancy.translations?.find((item) => item.languages_id === languageId)?.title || vacancy.slug
  );
}

async function uploadCv(file: File, safeFilename: string) {
  const folderId = process.env.DIRECTUS_CAREER_CV_FOLDER_ID;

  if (!folderId) {
    throw new Error("Career CV folder is not configured.");
  }

  const upload = new FormData();

  upload.append("folder", folderId);

  const storageLocation = process.env.DIRECTUS_CAREER_STORAGE;

  if (!storageLocation) {
    throw new Error("Career storage location is not configured.");
  }

  upload.append("storage", storageLocation);

  upload.append("title", safeFilename);

  upload.append("file", file, safeFilename);

  const result = await directusRequest<DirectusCreateResponse<UploadedFile>>("/files", {
    method: "POST",
    body: upload,
  });

  return result.data;
}

export async function POST(request: Request) {
  try {
    if (requestTooLarge(request, MAX_CAREER_REQUEST_SIZE)) {
      return jsonError("Request payload is too large.", 413);
    }

    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.includes("multipart/form-data")) {
      return jsonError("Invalid request format.", 415);
    }

    const formData = await request.formData();

    /*
     * Honeypot.
     * Human users never fill this field.
     */
    const website = cleanText(formData.get("website"), 200);

    if (website) {
      return noStoreJson({
        ok: true,
      });
    }

    const recaptchaToken = cleanText(formData.get("recaptchaToken"), 4096);

    const recaptcha = await verifyRecaptcha({
      token: recaptchaToken,
      expectedAction: "career_apply",
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    if (!recaptcha.ok) {
      console.warn("Career reCAPTCHA rejected", {
        reason: recaptcha.reason,
        score: recaptcha.score,
      });

      return jsonError("Unable to verify request.", 403);
    }

    const locale = cleanText(formData.get("locale"), 2) === "en" ? "en" : "id";

    const vacancySlug = cleanText(formData.get("vacancySlug"), 120);

    const fullName = cleanText(formData.get("fullName"), 150);

    const email = cleanText(formData.get("email"), 254).toLowerCase();

    const rawPhone = cleanText(formData.get("phone"), 40);
    const phone = normalizePhone(rawPhone);

    const linkedinUrl = cleanText(formData.get("linkedinUrl"), 500);

    const currentCompany = cleanText(formData.get("currentCompany"), 150);

    const currentPosition = cleanText(formData.get("currentPosition"), 150);

    const coverLetter = cleanText(formData.get("coverLetter"), 5000);

    const consent = formData.get("consent") === "true";

    const cv = formData.get("cv");

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(vacancySlug)) {
      return jsonError(locale === "id" ? "Lowongan tidak valid." : "Invalid vacancy.", 400);
    }

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

    if (!phone) {
      return jsonError(
        locale === "id" ? "Nomor telepon tidak valid." : "Invalid phone number.",
        400,
      );
    }

    if (!isValidLinkedInUrl(linkedinUrl)) {
      return jsonError(
        locale === "id"
          ? "URL LinkedIn tidak valid."
          : "Invalid LinkedIn URL.",
        400,
      );
    }

    if (!consent) {
      return jsonError(
        locale === "id"
          ? "Persetujuan pemrosesan data diperlukan."
          : "Data processing consent is required.",
        400,
      );
    }

    if (!(cv instanceof File)) {
      return jsonError(locale === "id" ? "CV wajib diunggah." : "CV is required.", 400);
    }

    if (cv.size <= 0 || cv.size > MAX_CV_SIZE) {
      return jsonError(
        locale === "id" ? "Ukuran CV maksimum 5 MB." : "Maximum CV size is 5 MB.",
        400,
      );
    }

    const extension = extensionOf(cv.name);

    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return jsonError(
        locale === "id" ? "CV harus berupa PDF, DOC, atau DOCX." : "CV must be PDF, DOC, or DOCX.",
        400,
      );
    }

    if (cv.type && !ALLOWED_MIME_TYPES.has(cv.type)) {
      return jsonError(
        locale === "id" ? "Format file CV tidak valid." : "Invalid CV file format.",
        400,
      );
    }

    /*
     * Do not trust extension or browser
     * MIME type. Validate the actual
     * binary header as well.
     */
    const buffer = await cv.arrayBuffer();

    const bytes = new Uint8Array(buffer.slice(0, 16));

    if (!validateFileSignature(extension, bytes)) {
      return jsonError(
        locale === "id"
          ? "Isi file CV tidak sesuai dengan format file."
          : "CV file content does not match its format.",
        400,
      );
    }

    const vacancy = await findPublishedVacancy(vacancySlug);

    if (!vacancy) {
      return jsonError(
        locale === "id" ? "Lowongan tidak tersedia." : "This vacancy is not available.",
        404,
      );
    }

    /*
     * Recreate the file from the
     * validated bytes.
     */
    const validatedFile = new File([buffer], cv.name, {
      type: cv.type || "application/octet-stream",
    });

    /*
     * Never preserve the applicant's
     * original filename in storage.
     */
    const safeFilename = `cv-${crypto.randomUUID()}.${extension}`;

    const uploaded = await uploadCv(validatedFile, safeFilename);

    /*
     * Store the application first.
     * This is the source of truth.
     */
    await directusRequest<DirectusCreateResponse<CareerApplication>>("/items/career_applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vacancy: vacancy.id,

        full_name: fullName,
        email,
        phone,

        linkedin_url: linkedinUrl || null,

        current_company: currentCompany || null,

        current_position: currentPosition || null,

        cover_letter: coverLetter || null,

        cv_file: uploaded.id,

        consent: true,
        status: "new",

        submitted_at: new Date().toISOString(),
      }),
    });

    /*
     * Email notification is best-effort.
     *
     * If Microsoft 365 temporarily fails,
     * the application remains successfully
     * recorded and the applicant must NOT
     * be encouraged to resubmit.
     *
     * CV is intentionally NOT attached.
     */
    try {
      await sendCareerApplicationNotification({
        applicantName: fullName,

        applicantEmail: email,

        applicantPhone: phone,

        vacancyTitle: vacancyTitleForLocale(vacancy, locale),

        vacancySlug: vacancy.slug,
      });
    } catch (mailError) {
      console.error("Career notification email failed", mailError);
    }

    return NextResponse.json(
      {
        ok: true,

        message:
          locale === "id" ? "Lamaran berhasil dikirim." : "Your application has been submitted.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Career application error", error);

    return jsonError("Unable to submit application.", 500);
  }
}

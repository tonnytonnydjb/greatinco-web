import "server-only";

import { directusRequest } from "@/lib/directus-http";

type DirectusResponse<T> = {
  data: T;
};

const RETRYABLE_STATUS_CODES = new Set([502, 503, 504]);
const RETRY_DELAYS_MS = [250, 500];

function getDirectusToken(): string {
  const token = process.env.DIRECTUS_TOKEN;

  if (!token) {
    throw new Error("DIRECTUS_TOKEN is not configured");
  }

  return token;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("fetch failed") ||
    message.includes("econnreset") ||
    message.includes("econnrefused") ||
    message.includes("etimedout") ||
    message.includes("socket") ||
    message.includes("network")
  );
}

export async function directusFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  let response: Response | null = null;
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      response = await directusRequest(path, getDirectusToken(), {
        ...options,
        headers: {
          Accept: "application/json",
          ...options?.headers,
        },
        next: {
          revalidate: 60,
        },
      });

      if (response.ok) {
        const payload = (await response.json()) as DirectusResponse<T>;
        return payload.data;
      }

      const shouldRetryResponse =
        RETRYABLE_STATUS_CODES.has(response.status) &&
        attempt < RETRY_DELAYS_MS.length;

      if (!shouldRetryResponse) {
        break;
      }

      await response.body?.cancel().catch(() => undefined);
      await sleep(RETRY_DELAYS_MS[attempt]);
    } catch (error) {
      lastError = error;

      const shouldRetryNetworkError =
        isRetryableNetworkError(error) &&
        attempt < RETRY_DELAYS_MS.length;

      if (!shouldRetryNetworkError) {
        throw error;
      }

      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }

  if (response) {
    const body = await response.text();

    throw new Error(
      [
        `Directus request failed: ${response.status} ${response.statusText}`,
        `Path: ${path}`,
        `Response: ${body}`,
      ].join("\n"),
    );
  }

  if (lastError instanceof Error) {
    throw new Error(
      [
        "Directus request failed after retries",
        `Path: ${path}`,
        `Cause: ${lastError.message}`,
      ].join("\n"),
    );
  }

  throw new Error(`Directus request failed before receiving a response: ${path}`);
}

export function directusAssetUrl(
  fileId: string | null | undefined,
): string | undefined {
  if (!fileId) {
    return undefined;
  }

  return `/api/cms/assets/${encodeURIComponent(fileId)}`;
}

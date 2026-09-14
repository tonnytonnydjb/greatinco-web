import "server-only";

import { directusRequest } from "@/lib/directus-http";

type DirectusResponse<T> = {
  data: T;
};

function getDirectusToken(): string {
  const token = process.env.DIRECTUS_TOKEN;

  if (!token) {
    throw new Error("DIRECTUS_TOKEN is not configured");
  }

  return token;
}

export async function directusFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await directusRequest(path, getDirectusToken(), {
    ...options,
    headers: {
      Accept: "application/json",
      ...options?.headers,
    },
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      [
        `Directus request failed: ${response.status} ${response.statusText}`,
        `Path: ${path}`,
        `Response: ${body}`,
      ].join("\n"),
    );
  }

  const payload = (await response.json()) as DirectusResponse<T>;

  return payload.data;
}

export function directusAssetUrl(fileId: string | null | undefined): string | undefined {
  if (!fileId) {
    return undefined;
  }

  return `/api/cms/assets/${encodeURIComponent(fileId)}`;
}

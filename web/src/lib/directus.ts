import "server-only";

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

if (!DIRECTUS_URL) {
  throw new Error("DIRECTUS_URL is not configured");
}

if (!DIRECTUS_TOKEN) {
  throw new Error("DIRECTUS_TOKEN is not configured");
}

type DirectusResponse<T> = {
  data: T;
};

export async function directusFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${DIRECTUS_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      ...options?.headers,
    },
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error(`Directus request failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as DirectusResponse<T>;

  return payload.data;
}

export function directusAssetUrl(fileId: string): string {
  return `${DIRECTUS_URL}/assets/${fileId}`;
}

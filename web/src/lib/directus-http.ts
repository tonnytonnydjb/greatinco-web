import "server-only";

import { GoogleAuth } from "google-auth-library";

const googleAuth = new GoogleAuth();

let idTokenClientPromise: ReturnType<GoogleAuth["getIdTokenClient"]> | null = null;

async function getCloudRunIamHeader(): Promise<Record<string, string>> {
  const audience = process.env.DIRECTUS_IAM_AUDIENCE?.trim();

  /*
   * Local Directus does not require Cloud Run IAM.
   * Production sets DIRECTUS_IAM_AUDIENCE to the
   * canonical Cloud Run service URL.
   */
  if (!audience) {
    return {};
  }

  idTokenClientPromise ??= googleAuth.getIdTokenClient(audience);

  const client = await idTokenClientPromise;

  const idToken = await client.idTokenProvider.fetchIdToken(audience);

  return {
    "X-Serverless-Authorization": `Bearer ${idToken}`,
  };
}

export async function directusRequest(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<Response> {
  const baseUrl = process.env.DIRECTUS_URL?.replace(/\/+$/, "");

  if (!baseUrl) {
    throw new Error("DIRECTUS_URL is not configured");
  }

  if (!token) {
    throw new Error("Directus token is not configured");
  }

  const iamHeaders = await getCloudRunIamHeader();

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${token}`);

  for (const [name, value] of Object.entries(iamHeaders)) {
    headers.set(name, value);
  }

  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });
}

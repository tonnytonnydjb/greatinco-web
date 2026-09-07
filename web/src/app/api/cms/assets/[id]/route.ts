import "server-only";

import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

if (!DIRECTUS_URL) {
  throw new Error("DIRECTUS_URL is not configured");
}

if (!DIRECTUS_TOKEN) {
  throw new Error("DIRECTUS_TOKEN is not configured");
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!/^[a-zA-Z0-9-]+$/.test(id)) {
    return NextResponse.json(
      {
        error: "Invalid asset id",
      },
      {
        status: 400,
      },
    );
  }

  const source = new URL(`/assets/${encodeURIComponent(id)}`, DIRECTUS_URL);

  const width = request.nextUrl.searchParams.get("width");

  const height = request.nextUrl.searchParams.get("height");

  const quality = request.nextUrl.searchParams.get("quality");

  const fit = request.nextUrl.searchParams.get("fit");

  if (width && /^\d+$/.test(width)) {
    source.searchParams.set("width", width);
  }

  if (height && /^\d+$/.test(height)) {
    source.searchParams.set("height", height);
  }

  if (quality && /^\d+$/.test(quality)) {
    source.searchParams.set("quality", quality);
  }

  if (fit && ["cover", "contain", "inside", "outside"].includes(fit)) {
    source.searchParams.set("fit", fit);
  }

  const response = await fetch(source, {
    headers: {
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      Accept: "image/*",
    },
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Asset not found",
      },
      {
        status: response.status,
      },
    );
  }

  const contentType = response.headers.get("content-type") ?? "application/octet-stream";

  const body = await response.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

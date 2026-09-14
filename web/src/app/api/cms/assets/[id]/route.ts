import { Storage } from "@google-cloud/storage";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PUBLIC_BUCKET =
  process.env.DIRECTUS_PUBLIC_ASSETS_BUCKET ?? "website-greatinco-directus-assets";

const storage = new Storage();

function isOriginalObject(id: string, objectName: string): boolean {
  return (
    objectName.startsWith(`${id}.`) &&
    !objectName.startsWith(`${id}__`) &&
    !objectName.includes("/")
  );
}

function safeDownloadName(objectName: string): string {
  return objectName.replace(/[\r\n"]/g, "").slice(0, 255);
}

function isLocalDirectus(): boolean {
  const url = process.env.DIRECTUS_URL ?? "";

  return (
    url.includes("127.0.0.1") || url.includes("localhost") || url.includes("host.docker.internal")
  );
}

async function getLocalDirectusAsset(id: string): Promise<NextResponse> {
  const directusUrl = process.env.DIRECTUS_URL;
  const token = process.env.DIRECTUS_TOKEN;

  if (!directusUrl || !token) {
    return NextResponse.json(
      { error: "Local Directus asset configuration unavailable" },
      { status: 503 },
    );
  }

  const response = await fetch(
    `${directusUrl.replace(/\/$/, "")}/assets/${encodeURIComponent(id)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  if (!response.ok) {
    console.error("Local Directus asset retrieval failed", response.status, response.statusText);

    return NextResponse.json({ error: "Asset service unavailable" }, { status: 503 });
  }

  const body = await response.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "private, max-age=60",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function getProductionAsset(id: string): Promise<NextResponse> {
  try {
    const bucket = storage.bucket(PUBLIC_BUCKET);

    const [files] = await bucket.getFiles({
      prefix: id,
      maxResults: 20,
      autoPaginate: false,
    });

    const original = files.find((file) => isOriginalObject(id, file.name));

    if (!original) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const [metadata] = await original.getMetadata();
    const [body] = await original.download();

    const contentType = metadata.contentType ?? "application/octet-stream";

    const filename = safeDownloadName(original.name);

    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Public asset retrieval failed", error);

    return NextResponse.json({ error: "Asset service unavailable" }, { status: 503 });
  }
}

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid asset id" }, { status: 400 });
  }

  if (isLocalDirectus()) {
    return getLocalDirectusAsset(id);
  }

  return getProductionAsset(id);
}

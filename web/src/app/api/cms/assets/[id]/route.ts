import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const WEBSITE_PUBLIC_ROOT_FOLDER_ID = "9306d020-b152-4453-8f22-5082daa1ec2b";

type DirectusFile = {
  id: string;
  folder:
    | string
    | {
        id?: string | null;
      }
    | null;
  type?: string | null;
};

type DirectusFolder = {
  id: string;
  parent:
    | string
    | {
        id?: string | null;
      }
    | null;
};

type DirectusItemResponse<T> = {
  data: T;
};

function extractId(
  value:
    | string
    | {
        id?: string | null;
      }
    | null,
): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  return value.id ?? null;
}

function safeInteger(value: string | null, min: number, max: number): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    return null;
  }

  return parsed;
}

async function directusMetadataFetch<T>(
  directusUrl: string,
  token: string,
  path: string,
): Promise<T | null> {
  const response = await fetch(`${directusUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as DirectusItemResponse<T>;

  return payload.data ?? null;
}

async function isInsideWebsitePublic(
  directusUrl: string,
  token: string,
  folderId: string | null,
): Promise<boolean> {
  if (!folderId) {
    return false;
  }

  let currentFolderId: string | null = folderId;

  const visited = new Set<string>();

  /*
   * Safety cap prevents malformed folder
   * structures from causing infinite loops.
   */
  for (let depth = 0; depth < 20; depth += 1) {
    if (!currentFolderId) {
      return false;
    }

    if (currentFolderId === WEBSITE_PUBLIC_ROOT_FOLDER_ID) {
      return true;
    }

    if (visited.has(currentFolderId)) {
      return false;
    }

    visited.add(currentFolderId);

    const folder = await directusMetadataFetch<DirectusFolder>(
      directusUrl,
      token,
      `/folders/${encodeURIComponent(currentFolderId)}?fields=id,parent`,
    );

    if (!folder) {
      return false;
    }

    currentFolderId = extractId(folder.parent);
  }

  return false;
}

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json(
      {
        error: "Invalid asset id",
      },
      {
        status: 400,
      },
    );
  }

  const directusUrl = process.env.DIRECTUS_URL;

  const token = process.env.DIRECTUS_TOKEN;

  if (!directusUrl || !token) {
    console.error("CMS asset proxy configuration missing");

    return NextResponse.json(
      {
        error: "Asset service unavailable",
      },
      {
        status: 503,
      },
    );
  }

  const file = await directusMetadataFetch<DirectusFile>(
    directusUrl,
    token,
    `/files/${encodeURIComponent(id)}?fields=id,folder,type`,
  );

  if (!file) {
    return NextResponse.json(
      {
        error: "Asset not found",
      },
      {
        status: 404,
      },
    );
  }

  const folderId = extractId(file.folder);

  const allowed = await isInsideWebsitePublic(directusUrl, token, folderId);

  if (!allowed) {
    /*
     * Fail closed:
     * anything outside website-public
     * is treated as non-existent.
     */
    return NextResponse.json(
      {
        error: "Asset not found",
      },
      {
        status: 404,
      },
    );
  }

  const assetUrl = new URL(`${directusUrl}/assets/${encodeURIComponent(id)}`);

  const width = safeInteger(request.nextUrl.searchParams.get("width"), 1, 4000);

  const height = safeInteger(request.nextUrl.searchParams.get("height"), 1, 4000);

  const quality = safeInteger(request.nextUrl.searchParams.get("quality"), 1, 100);

  const fit = request.nextUrl.searchParams.get("fit");

  if (width !== null) {
    assetUrl.searchParams.set("width", String(width));
  }

  if (height !== null) {
    assetUrl.searchParams.set("height", String(height));
  }

  if (quality !== null) {
    assetUrl.searchParams.set("quality", String(quality));
  }

  if (fit && ["cover", "contain", "inside", "outside"].includes(fit)) {
    assetUrl.searchParams.set("fit", fit);
  }

  const assetResponse = await fetch(assetUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!assetResponse.ok) {
    return NextResponse.json(
      {
        error: "Asset not found",
      },
      {
        status: 404,
      },
    );
  }

  const body = await assetResponse.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type":
        assetResponse.headers.get("content-type") ?? file.type ?? "application/octet-stream",

      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",

      "X-Content-Type-Options": "nosniff",
    },
  });
}

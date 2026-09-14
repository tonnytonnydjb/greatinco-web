import { Storage } from "@google-cloud/storage";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PUBLIC_BUCKET =
  process.env.DIRECTUS_PUBLIC_ASSETS_BUCKET ?? "website-greatinco-directus-assets";

const storage = new Storage();

function isOriginalObject(id: string, objectName: string): boolean {
  /*
   * Directus originals use:
   *   <uuid>.<extension>
   *
   * Generated transformations use:
   *   <uuid>__<hash>.<extension>
   *
   * Only originals are eligible.
   */
  return (
    objectName.startsWith(`${id}.`) &&
    !objectName.startsWith(`${id}__`) &&
    !objectName.includes("/")
  );
}

function safeDownloadName(objectName: string): string {
  return objectName.replace(/[\r\n"]/g, "").slice(0, 255);
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
    return NextResponse.json(
      {
        error: "Invalid asset id",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const bucket = storage.bucket(PUBLIC_BUCKET);

    /*
     * We intentionally do not query Directus
     * metadata here.
     *
     * The web runtime can only read the
     * public-assets bucket. It has no IAM
     * access to the career-private bucket.
     */
    const [files] = await bucket.getFiles({
      prefix: id,
      maxResults: 20,
      autoPaginate: false,
    });

    const original = files.find((file) => isOriginalObject(id, file.name));

    if (!original) {
      return NextResponse.json(
        {
          error: "Asset not found",
        },
        {
          status: 404,
        },
      );
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

    return NextResponse.json(
      {
        error: "Asset service unavailable",
      },
      {
        status: 503,
      },
    );
  }
}

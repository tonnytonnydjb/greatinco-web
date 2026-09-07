import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";

const BASE = process.env.DIRECTUS_URL || "http://127.0.0.1:8055";

const TOKEN = process.env.DIRECTUS_SEED_TOKEN;

if (!TOKEN) {
  throw new Error("DIRECTUS_SEED_TOKEN belum tersedia");
}

const assets = [
  {
    field: "logo_light",
    file: "public/brand/greatinco-logo-white.png",
    title: "Greatinco Logo Light",
  },
  {
    field: "logo_dark",
    file: "public/brand/greatinco-logo-gradient.png",
    title: "Greatinco Logo Dark",
  },
  {
    field: "logogram",
    file: "public/brand/greatinco-logogram.png",
    title: "Greatinco Logogram",
  },
  {
    field: "favicon",
    file: "public/favicon/favicon-32.png",
    title: "Greatinco Favicon",
  },
];

function mimeType(file) {
  const ext = extname(file).toLowerCase();

  if (ext === ".png") {
    return "image/png";
  }

  if (ext === ".jpg" || ext === ".jpeg") {
    return "image/jpeg";
  }

  if (ext === ".ico") {
    return "image/x-icon";
  }

  throw new Error(`Unsupported file type: ${file}`);
}

async function api(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    throw new Error(
      [
        `${response.status} ${response.statusText}`,
        path,
        typeof payload === "string" ? payload : JSON.stringify(payload, null, 2),
      ].join("\n"),
    );
  }

  return payload;
}

async function findExistingFile(title) {
  const params = new URLSearchParams({
    fields: "id,title,filename_download",
    limit: "1",
  });

  params.set("filter[title][_eq]", title);

  const result = await api(`/files?${params.toString()}`);

  return result?.data?.[0] ?? null;
}

async function upload(file, title) {
  const existing = await findExistingFile(title);

  if (existing?.id) {
    console.log(`reuse ${title}: ${existing.id}`);

    return existing;
  }

  const bytes = await readFile(file);

  const form = new FormData();

  form.append(
    "file",
    new Blob([bytes], {
      type: mimeType(file),
    }),
    basename(file),
  );

  form.append("title", title);

  const response = await fetch(`${BASE}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: form,
  });

  const text = await response.text();

  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      [`${response.status} ${response.statusText}`, `Upload ${file}`, text].join("\n"),
    );
  }

  console.log(`uploaded ${title}: ${payload.data.id}`);

  return payload.data;
}

async function patchSingleton(payload) {
  /*
   * site_settings adalah Directus Singleton.
   * Singleton di-update tanpa primary key di URL.
   */
  return api("/items/site_settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function main() {
  const result = await api("/items/site_settings?fields=id,logo_light,logo_dark,logogram,favicon");

  const settings = result?.data;

  if (!settings?.id) {
    throw new Error("site_settings singleton tidak ditemukan");
  }

  console.log(`site_settings singleton id=${settings.id}`);

  for (const asset of assets) {
    if (settings[asset.field]) {
      console.log(`skip ${asset.field}: already configured (${settings[asset.field]})`);

      continue;
    }

    const file = await upload(asset.file, asset.title);

    await patchSingleton({
      [asset.field]: file.id,
    });

    settings[asset.field] = file.id;

    console.log(`linked ${asset.field}: ${file.id}`);
  }

  console.log("\nSite settings media migration complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

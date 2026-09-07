import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";

const BASE = process.env.DIRECTUS_URL || "http://127.0.0.1:8055";

const TOKEN = process.env.DIRECTUS_SEED_TOKEN;

if (!TOKEN) {
  throw new Error("DIRECTUS_SEED_TOKEN belum diset");
}

const clients = [
  {
    name: "Akulaku",
    file: "public/clients/Akulaku.png",
  },
  {
    name: "Amar Bank",
    file: "public/clients/AmarBank.png",
  },
  {
    name: "BFI Finance",
    file: "public/clients/BFI.png",
  },
  {
    name: "Bank Neo Commerce",
    file: "public/clients/BNC.png",
  },
  {
    name: "Generali",
    file: "public/clients/Generali.png",
  },
  {
    name: "Manulife",
    file: "public/clients/Manulife.png",
  },
  {
    name: "SPayLater",
    file: "public/clients/SPayLater.png",
  },
  {
    name: "Traveloka",
    file: "public/clients/traveloka.png",
  },
  {
    name: "JULO",
    file: "public/clients/julo.png",
  },
  {
    name: "Indodana",
    file: "public/clients/indodana.png",
  },
];

const certifications = [
  {
    name: "AFPI",
    file: "public/certifications/afpi.png",
  },
  {
    name: "ISO 27001",
    file: "public/certifications/iso-27001.png",
  },
  {
    name: "ISO 9001",
    file: "public/certifications/iso-9001.png",
  },
  {
    name: "LSPPI",
    file: "public/certifications/lsppi.png",
  },
];

const activities = [
  {
    slug: "greatinco-head-office-gathering-2026",
    file: "public/activities/bukber-ho-2026-1.jpeg",
  },
  {
    slug: "greatinco-malang-team-gathering-2026",
    file: "public/activities/bukber-malang-2026.jpeg",
  },
  {
    slug: "training-refreshment-2026",
    file: "public/activities/training-refreshment.jpg",
  },
];

async function api(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}\n${path}\n${text}`);
  }

  return payload;
}

function contentType(file) {
  const extension = extname(file).toLowerCase();

  if (extension === ".png") return "image/png";

  if (extension === ".jpg" || extension === ".jpeg") {
    return "image/jpeg";
  }

  throw new Error(`Unsupported file type: ${file}`);
}

async function upload(file, title) {
  const bytes = await readFile(file);

  const form = new FormData();

  form.append(
    "file",
    new Blob([bytes], {
      type: contentType(file),
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
    throw new Error(`${response.status} ${response.statusText}\nUpload ${file}\n${text}`);
  }

  return payload.data;
}

async function migrateByField({ collection, matchField, matchValue, fileField, file, title }) {
  const params = new URLSearchParams({
    fields: `id,${matchField},${fileField}`,
    limit: "1",
  });

  params.set(`filter[${matchField}][_eq]`, matchValue);

  const result = await api(`/items/${collection}?${params.toString()}`);

  const item = result.data?.[0];

  if (!item) {
    throw new Error(`${collection} record not found: ${matchValue}`);
  }

  if (item[fileField]) {
    console.log(`skip ${collection}: ${matchValue} already has ${fileField}`);
    return;
  }

  const uploaded = await upload(file, title);

  await api(`/items/${collection}/${item.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      [fileField]: uploaded.id,
    }),
  });

  console.log(`migrated ${collection}: ${matchValue} -> ${uploaded.id}`);
}

async function main() {
  console.log("=== CLIENT LOGOS ===");

  for (const item of clients) {
    await migrateByField({
      collection: "clients",
      matchField: "name",
      matchValue: item.name,
      fileField: "logo",
      file: item.file,
      title: `Greatinco Client - ${item.name}`,
    });
  }

  console.log("\n=== CERTIFICATIONS ===");

  for (const item of certifications) {
    await migrateByField({
      collection: "certifications",
      matchField: "name",
      matchValue: item.name,
      fileField: "logo",
      file: item.file,
      title: `Greatinco Certification - ${item.name}`,
    });
  }

  console.log("\n=== ACTIVITIES ===");

  for (const item of activities) {
    await migrateByField({
      collection: "activities",
      matchField: "slug",
      matchValue: item.slug,
      fileField: "cover_image",
      file: item.file,
      title: `Greatinco Activity - ${item.slug}`,
    });
  }

  console.log("\nMedia migration complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

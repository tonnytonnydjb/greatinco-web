const BASE = process.env.DIRECTUS_URL || "http://127.0.0.1:8055";

const TOKEN = process.env.DIRECTUS_SEED_TOKEN;

const APPLY = process.env.APPLY === "1";

if (!TOKEN) {
  throw new Error("DIRECTUS_SEED_TOKEN belum SET");
}

async function api(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
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

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

async function getFolders() {
  const result = await api("/folders?fields=id,name,parent&limit=-1");

  return result.data ?? [];
}

async function ensureFolder(name, parent = null) {
  let folders = await getFolders();

  const existing = folders.find((folder) => {
    const folderParent = typeof folder.parent === "object" ? folder.parent?.id : folder.parent;

    return folder.name === name && (folderParent ?? null) === (parent ?? null);
  });

  if (existing) {
    console.log(`folder exists: ${name} -> ${existing.id}`);

    return existing.id;
  }

  if (!APPLY) {
    console.log(`[DRY RUN] would create folder: ${name}`);

    return `DRY-RUN-${name}`;
  }

  const created = await api("/folders", {
    method: "POST",
    body: JSON.stringify({
      name,
      parent,
    }),
  });

  console.log(`created folder: ${name} -> ${created.data.id}`);

  return created.data.id;
}

async function getFiles() {
  const result = await api("/files?fields=id,title,filename_download,folder,type&limit=-1");

  return result.data ?? [];
}

const categoryMatchers = {
  brand: [
    "greatincologo",
    "greatincologowhite",
    "greatincologogradient",
    "greatincologogram",
    "greatincofavicon",
    "favicon",
  ],

  clients: [
    "akulaku",
    "amarbank",
    "amar",
    "bfi",
    "bnc",
    "bankneocommerce",
    "generali",
    "manulife",
    "spaylater",
    "shopeepaylater",
    "traveloka",
    "julo",
    "indodana",
  ],

  certifications: ["afpi", "iso27001", "iso9001", "lsppi"],

  activities: [
    "bukberho2026",
    "bukbermalang2026",
    "trainingrefreshment",
    "training",
    "refreshment",
    "gathering2026",
  ],
};

function classify(file) {
  const haystack = normalize([file.title, file.filename_download].filter(Boolean).join(" "));

  for (const [category, matchers] of Object.entries(categoryMatchers)) {
    if (matchers.some((matcher) => haystack.includes(normalize(matcher)))) {
      return category;
    }
  }

  return null;
}

function folderIdOf(file) {
  if (!file.folder) {
    return null;
  }

  if (typeof file.folder === "string") {
    return file.folder;
  }

  return file.folder.id ?? null;
}

async function moveFile(file, destinationFolderId, category) {
  const currentFolder = folderIdOf(file);

  if (currentFolder === destinationFolderId) {
    console.log(`skip already moved: ${file.filename_download || file.title}`);

    return;
  }

  const label = file.filename_download || file.title || file.id;

  if (!APPLY) {
    console.log(`[DRY RUN] ${category}: ${label}`);

    return;
  }

  await api(`/files/${file.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      folder: destinationFolderId,
    }),
  });

  console.log(`moved ${category}: ${label}`);
}

async function main() {
  console.log(APPLY ? "\n=== APPLY MODE ===\n" : "\n=== DRY RUN MODE ===\n");

  const rootId = await ensureFolder("website-public", null);

  const folderIds = {
    brand: await ensureFolder("brand", rootId),

    clients: await ensureFolder("clients", rootId),

    certifications: await ensureFolder("certifications", rootId),

    activities: await ensureFolder("activities", rootId),
  };

  const files = await getFiles();

  const matched = [];
  const unmatched = [];

  for (const file of files) {
    const category = classify(file);

    if (!category) {
      unmatched.push(file);
      continue;
    }

    matched.push({
      file,
      category,
    });
  }

  console.log(`Matched files: ${matched.length}`);

  for (const { file, category } of matched) {
    await moveFile(file, folderIds[category], category);
  }

  console.log("\n--- UNMATCHED FILES ---");

  for (const file of unmatched) {
    console.log([file.id, file.title || "-", file.filename_download || "-"].join(" | "));
  }

  console.log("\n--- PUBLIC FOLDER IDS ---");

  console.log(`website-public: ${rootId}`);

  for (const [name, id] of Object.entries(folderIds)) {
    console.log(`${name}: ${id}`);
  }

  console.log(
    APPLY
      ? "\nMigration complete."
      : "\nDRY RUN ONLY. Nothing was changed.\nRun again with APPLY=1 after reviewing.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

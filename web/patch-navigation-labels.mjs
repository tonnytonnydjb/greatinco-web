const BASE = process.env.DIRECTUS_URL || "http://127.0.0.1:8055";
const TOKEN = process.env.DIRECTUS_SEED_TOKEN;

if (!TOKEN) throw new Error("DIRECTUS_SEED_TOKEN belum diset");

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    console.error(data);
    process.exit(1);
  }

  return data;
}

async function main() {
  const nav = await request("/items/navigation?limit=-1");
  const translations = await request("/items/navigation_translations?limit=-1");

  const labels = {
    "/company": {
      1: "Perusahaan",
      2: "Company",
    },
    "/solutions": {
      1: "Solusi",
      2: "Solutions",
    },
    "/activities": {
      1: "Aktivitas",
      2: "Activities",
    },
    "/career": {
      1: "Karier",
      2: "Careers",
    },
    "/contact": {
      1: "Kontak",
      2: "Contact",
    },
  };

  for (const item of nav.data) {
    const map = labels[item.url];
    if (!map) continue;

    for (const tr of translations.data) {
      if (tr.navigation_id !== item.id) continue;

      const label = map[tr.languages_id];
      if (!label) continue;

      await request(`/items/navigation_translations/${tr.id}`, {
        method: "PATCH",
        body: JSON.stringify({ label }),
      });

      console.log(`patched ${item.location} ${item.url} -> ${label}`);
    }
  }

  console.log("Navigation labels selesai.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

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
  const payload = text ? JSON.parse(text) : null;

  if (!res.ok) {
    console.error(payload);
    process.exit(1);
  }

  return payload;
}

async function main() {
  const rows = await request("/items/homepage_translations?limit=-1");

  for (const row of rows.data) {
    const isId = row.languages_id === 1;

    await request(`/items/homepage_translations/${row.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        solution_eyebrow: isId ? "SOLUSI KAMI" : "OUR SOLUTIONS",
        solution_title: isId
          ? "Solusi terintegrasi di setiap tahap pengelolaan kredit."
          : "Integrated solutions across the credit management lifecycle.",
        solution_description: isId
          ? "Setiap solusi dirancang untuk mendukung institusi keuangan dalam meningkatkan kontrol, efisiensi, dan hasil pemulihan."
          : "Each solution is designed to help financial institutions improve control, efficiency and recovery outcomes.",
      }),
    });

    console.log(`patched homepage translation ${row.id}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

const BASE = process.env.DIRECTUS_URL || "http://127.0.0.1:8055";
const TOKEN = process.env.DIRECTUS_SEED_TOKEN;

if (!TOKEN) {
  throw new Error("DIRECTUS_SEED_TOKEN belum diset");
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    console.error(`ERROR ${response.status}: ${path}`);
    console.error(payload);
    process.exit(1);
  }

  return payload;
}

async function getAll(collection) {
  const response = await request(`/items/${collection}?limit=-1`);
  return response?.data ?? [];
}

async function create(collection, payload) {
  return request(`/items/${collection}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function update(collection, id, payload) {
  return request(`/items/${collection}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

const activities = [
  {
    slug: "greatinco-head-office-gathering-2026",
    activity_date: "2026-03-20",
    sort: 1,
    featured: true,
    id: {
      title: "Membangun kolaborasi melalui kebersamaan tim",
      category: "company_activity",
      summary:
        "Kebersamaan tim Greatinco sebagai bagian dari upaya membangun kolaborasi dan hubungan kerja yang lebih kuat.",
      content:
        "<p>Kegiatan bersama tim Greatinco menjadi ruang untuk memperkuat kolaborasi, komunikasi, dan hubungan antar fungsi dalam organisasi.</p>",
      seo_title: "Kebersamaan Tim Greatinco | Greatinco",
      seo_description:
        "Aktivitas kebersamaan tim Greatinco dalam membangun kolaborasi dan hubungan kerja yang lebih kuat.",
    },
    en: {
      title: "Building collaboration through shared team experiences",
      category: "company_activity",
      summary:
        "A Greatinco team gathering focused on strengthening collaboration and connection across the organization.",
      content:
        "<p>Greatinco team activities provide opportunities to strengthen collaboration, communication and connection across functions.</p>",
      seo_title: "Greatinco Team Gathering | Greatinco",
      seo_description:
        "Greatinco team activities focused on strengthening collaboration and connection across the organization.",
    },
  },
  {
    slug: "greatinco-malang-team-gathering-2026",
    activity_date: "2026-03-20",
    sort: 2,
    featured: true,
    id: {
      title: "Kebersamaan tim Greatinco Malang",
      category: "team_activity",
      summary:
        "Aktivitas tim Greatinco Malang untuk memperkuat kebersamaan dan kolaborasi operasional.",
      content:
        "<p>Kegiatan tim Greatinco Malang mendukung budaya kerja yang kolaboratif dan hubungan tim yang semakin kuat.</p>",
      seo_title: "Aktivitas Tim Greatinco Malang | Greatinco",
      seo_description: "Kegiatan tim Greatinco Malang dalam membangun kebersamaan dan kolaborasi.",
    },
    en: {
      title: "Greatinco Malang team gathering",
      category: "team_activity",
      summary:
        "A Greatinco Malang team activity designed to strengthen teamwork and operational collaboration.",
      content:
        "<p>Greatinco Malang team activities support a collaborative culture and stronger working relationships.</p>",
      seo_title: "Greatinco Malang Team Activity | Greatinco",
      seo_description: "Greatinco Malang team activities supporting teamwork and collaboration.",
    },
  },
  {
    slug: "training-refreshment-2026",
    activity_date: "2026-03-01",
    sort: 3,
    featured: true,
    id: {
      title: "Pengembangan kompetensi melalui pelatihan dan penyegaran",
      category: "training",
      summary:
        "Program pelatihan dan penyegaran untuk meningkatkan kompetensi, kualitas, dan konsistensi operasional.",
      content:
        "<p>Greatinco menjalankan program pelatihan dan refreshment secara berkala untuk mendukung peningkatan kompetensi dan kualitas operasional.</p>",
      seo_title: "Pelatihan & Pengembangan Tim | Greatinco",
      seo_description:
        "Program pelatihan dan refreshment Greatinco untuk mendukung kompetensi dan kualitas operasional.",
    },
    en: {
      title: "Developing capability through training and refreshment",
      category: "training",
      summary:
        "Training and refreshment programs supporting capability, quality and operational consistency.",
      content:
        "<p>Greatinco conducts regular training and refreshment programs to support capability development and operational quality.</p>",
      seo_title: "Training & People Development | Greatinco",
      seo_description:
        "Greatinco training and refreshment programs supporting capability and operational quality.",
    },
  },
];

async function main() {
  const languages = await getAll("languages");
  const existingActivities = await getAll("activities");
  const existingTranslations = await getAll("activities_translations");

  const idLanguage = languages.find((item) => item.code === "id-ID");
  const enLanguage = languages.find((item) => item.code === "en-US");

  if (!idLanguage || !enLanguage) {
    throw new Error("Language ID/EN tidak ditemukan");
  }

  for (const item of activities) {
    let activity = existingActivities.find((existing) => existing.slug === item.slug);

    if (!activity) {
      const created = await create("activities", {
        slug: item.slug,
        activity_date: item.activity_date,
        featured: item.featured,
        sort: item.sort,
        status: "published",
      });

      activity = created.data;
      console.log(`created activity: ${item.slug}`);
    }

    for (const translation of [
      { languageId: idLanguage.id, content: item.id, label: "ID" },
      { languageId: enLanguage.id, content: item.en, label: "EN" },
    ]) {
      const existing = existingTranslations.find(
        (row) => row.activities_id === activity.id && row.languages_id === translation.languageId,
      );

      if (existing) {
        await update("activities_translations", existing.id, translation.content);
        console.log(`updated ${item.slug} ${translation.label}`);
      } else {
        await create("activities_translations", {
          activities_id: activity.id,
          languages_id: translation.languageId,
          ...translation.content,
        });
        console.log(`created ${item.slug} ${translation.label}`);
      }
    }
  }

  console.log("Activities seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

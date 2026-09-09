const BASE = process.env.DIRECTUS_URL || "http://127.0.0.1:8055";

const TOKEN = process.env.DIRECTUS_SEED_TOKEN;

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
      `${response.status} ${response.statusText}\n${path}\n${JSON.stringify(payload, null, 2)}`,
    );
  }

  return payload;
}

async function main() {
  const existing = await api(
    "/items/vacancies?fields=id,slug&filter[slug][_eq]=website-career-test&limit=1",
  );

  let vacancy = existing.data?.[0];

  if (!vacancy) {
    const created = await api("/items/vacancies", {
      method: "POST",
      body: JSON.stringify({
        slug: "website-career-test",
        department: "Technology",
        location: "Jakarta",
        employment_type: "Full Time",
        status: "published",
        sort: 999,
        published_at: new Date().toISOString(),
      }),
    });

    vacancy = created.data;

    console.log(`Created vacancy ID: ${vacancy.id}`);
  } else {
    console.log(`Existing vacancy ID: ${vacancy.id}`);
  }

  const languages = await api("/items/languages?fields=id,code&limit=-1");

  const idLanguage = languages.data.find((item) => item.code === "id-ID");

  const enLanguage = languages.data.find((item) => item.code === "en-US");

  if (!idLanguage || !enLanguage) {
    throw new Error("Language ID/EN tidak ditemukan");
  }

  const translations = [
    {
      languages_id: idLanguage.id,
      title: "Website Career Integration Test",
      summary: "Posisi sementara untuk pengujian sistem rekrutmen Greatinco.",
      description: "Ini adalah lowongan pengujian sistem website.",
      requirements: "Pengujian internal saja.",
      benefits: "Tidak berlaku.",
      seo_title: "Career Test | Greatinco",
      seo_description: "Temporary career integration test.",
    },
    {
      languages_id: enLanguage.id,
      title: "Website Career Integration Test",
      summary: "Temporary role for testing the Greatinco recruitment system.",
      description: "This is a website integration test vacancy.",
      requirements: "Internal testing only.",
      benefits: "Not applicable.",
      seo_title: "Career Test | Greatinco",
      seo_description: "Temporary career integration test.",
    },
  ];

  for (const translation of translations) {
    const existingTranslation = await api(
      `/items/vacancies_translations?fields=id&filter[vacancies_id][_eq]=${vacancy.id}&filter[languages_id][_eq]=${translation.languages_id}&limit=1`,
    );

    if (existingTranslation.data?.length) {
      console.log(`Translation exists: ${translation.languages_id}`);
      continue;
    }

    await api("/items/vacancies_translations", {
      method: "POST",
      body: JSON.stringify({
        vacancies_id: vacancy.id,
        ...translation,
      }),
    });

    console.log(`Created translation: ${translation.languages_id}`);
  }

  console.log("\nTEST VACANCY READY");
  console.log("slug: website-career-test");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

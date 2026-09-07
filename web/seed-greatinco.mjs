const BASE = process.env.DIRECTUS_URL || "http://127.0.0.1:8055";
const TOKEN = process.env.DIRECTUS_SEED_TOKEN;

if (!TOKEN) {
  throw new Error("DIRECTUS_SEED_TOKEN belum diset");
}

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

  if (!res.ok) {
    console.error(`ERROR ${res.status} ${path}`);
    console.error(text);
    process.exit(1);
  }

  return text ? JSON.parse(text) : null;
}

async function getAll(collection) {
  const result = await request(`/items/${collection}?limit=-1`);
  return result?.data ?? [];
}

async function create(collection, data) {
  return request(`/items/${collection}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function patchSingleton(collection, data) {
  return request(`/items/${collection}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async function seedLanguages() {
  const rows = await getAll("languages");

  const wanted = [
    { code: "id-ID", name: "Bahasa Indonesia", status: "active" },
    { code: "en-US", name: "English", status: "active" },
  ];

  for (const lang of wanted) {
    const existing = rows.find((x) => x.code === lang.code);

    if (!existing) {
      console.log(`Creating language ${lang.code}`);
      await create("languages", lang);
    }
  }
}

async function seedSiteSettings() {
  console.log("Seeding site_settings");

  await patchSingleton("site_settings", {
    site_name: "Greatinco",
    contact_email: "enquiries@greatinco.com",
  });
}

async function seedHomepage() {
  console.log("Seeding homepage");

  await patchSingleton("homepage", {
    show_clients: true,
    show_capabilities: true,
    show_solutions: true,
    show_governance: true,
    show_activities: true,
    show_final_cta: true,
  });
}

async function seedClients() {
  console.log("Seeding clients");

  const clients = [
    "Akulaku",
    "Amar Bank",
    "BFI Finance",
    "Bank Neo Commerce",
    "Generali",
    "Manulife",
    "SPayLater",
    "Traveloka",
    "JULO",
    "Indodana",
  ];

  const existing = await getAll("clients");

  for (const [index, name] of clients.entries()) {
    if (existing.some((x) => x.name === name)) continue;

    await create("clients", {
      name,
      status: "published",
      featured: true,
      sort: index + 1,
    });

    console.log(`  + ${name}`);
  }
}

async function seedCertifications() {
  console.log("Seeding certifications");

  const rows = [
    {
      name: "AFPI",
      credential_type: "membership",
      sort: 1,
    },
    {
      name: "ISO 27001",
      credential_type: "standard",
      sort: 2,
    },
    {
      name: "ISO 9001",
      credential_type: "standard",
      sort: 3,
    },
    {
      name: "LSPPI",
      credential_type: "professional_body",
      sort: 4,
    },
  ];

  const existing = await getAll("certifications");

  for (const row of rows) {
    if (existing.some((x) => x.name === row.name)) continue;

    await create("certifications", {
      ...row,
      status: "published",
      featured: true,
    });

    console.log(`  + ${row.name}`);
  }
}

async function seedSolutions() {
  console.log("Seeding solutions");

  const rows = [
    {
      slug: "credit-servicing-recovery",
      sort: 1,
    },
    {
      slug: "desk-collection",
      sort: 2,
    },
    {
      slug: "field-collection",
      sort: 3,
    },
    {
      slug: "collection-manpower",
      sort: 4,
    },
    {
      slug: "portfolio-strategy-investment",
      sort: 5,
    },
  ];

  const existing = await getAll("solutions");

  for (const row of rows) {
    if (existing.some((x) => x.slug === row.slug)) continue;

    await create("solutions", {
      ...row,
      status: "published",
      featured: true,
    });

    console.log(`  + ${row.slug}`);
  }
}

async function seedNavigation() {
  console.log("Seeding navigation");

  const rows = [
    { location: "header", url: "/company", sort: 1 },
    { location: "header", url: "/solutions", sort: 2 },
    { location: "header", url: "/activities", sort: 3 },
    { location: "header", url: "/career", sort: 4 },
    { location: "header", url: "/contact", sort: 5 },

    { location: "footer", url: "/company", sort: 10 },
    { location: "footer", url: "/solutions", sort: 20 },
    { location: "footer", url: "/activities", sort: 30 },
    { location: "footer", url: "/career", sort: 40 },
    { location: "footer", url: "/contact", sort: 50 },
  ];

  const existing = await getAll("navigation");

  for (const row of rows) {
    if (existing.some((x) => x.location === row.location && x.url === row.url)) {
      continue;
    }

    await create("navigation", {
      ...row,
      status: "published",
      open_in_new_tab: false,
      is_external: false,
    });

    console.log(`  + ${row.location} ${row.url}`);
  }
}

async function main() {
  console.log("=== GREATINCO DIRECTUS SEED ===");

  await seedLanguages();
  await seedSiteSettings();
  await seedHomepage();
  await seedClients();
  await seedCertifications();
  await seedSolutions();
  await seedNavigation();

  console.log("");
  console.log("Seed base selesai.");
  console.log(
    "Logo, image, translation text, dan media tetap diisi setelah base records tersedia.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

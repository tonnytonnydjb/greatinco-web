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

  let payload = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    console.error(`\nERROR ${response.status}: ${path}`);
    console.error(payload);
    process.exit(1);
  }

  return payload;
}

async function getAll(collection, query = "limit=-1") {
  const response = await request(`/items/${collection}?${query}`);
  return response?.data ?? [];
}

async function getSingleton(collection) {
  const response = await request(`/items/${collection}?fields=*,translations.*`);

  return response?.data;
}

async function create(collection, data) {
  return request(`/items/${collection}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function update(collection, id, data) {
  return request(`/items/${collection}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async function upsertTranslation({ collection, parentField, parentId, languageId, data }) {
  const rows = await getAll(
    collection,
    `filter[${parentField}][_eq]=${parentId}&filter[languages_id][_eq]=${languageId}&limit=1`,
  );

  if (rows.length > 0) {
    await update(collection, rows[0].id, data);
    return "updated";
  }

  await create(collection, {
    [parentField]: parentId,
    languages_id: languageId,
    ...data,
  });

  return "created";
}

async function getLanguages() {
  const rows = await getAll("languages");

  const id = rows.find((row) => row.code === "id-ID");
  const en = rows.find((row) => row.code === "en-US");

  if (!id || !en) {
    throw new Error("Language id-ID / en-US tidak ditemukan");
  }

  return { id, en };
}

async function seedSiteSettings(languages) {
  console.log("\n--- Site Settings ---");

  const siteSettings = await getSingleton("site_settings");

  if (!siteSettings?.id) {
    throw new Error(
      "site_settings belum memiliki ID. Buka Site Settings di Directus dan Save sekali.",
    );
  }

  const translations = [
    {
      languageId: languages.id.id,
      label: "ID",
      data: {
        footer_description:
          "Solusi manajemen kredit, penagihan, pemulihan, dan pengelolaan portofolio bagi institusi keuangan.",
        seo_title: "Greatinco | Manajemen Kredit & Asset Servicing",
        seo_description:
          "Greatinco menyediakan solusi manajemen kredit, collection, recovery, dan strategi portofolio bagi institusi keuangan di Indonesia.",
      },
    },
    {
      languageId: languages.en.id,
      label: "EN",
      data: {
        footer_description:
          "Integrated credit management, collection, recovery and portfolio solutions for financial institutions.",
        seo_title: "Greatinco | Credit Management & Asset Servicing",
        seo_description:
          "Greatinco provides credit management, collection, recovery and portfolio strategy solutions for financial institutions in Indonesia.",
      },
    },
  ];

  for (const item of translations) {
    const result = await upsertTranslation({
      collection: "site_settings_translations",
      parentField: "site_settings_id",
      parentId: siteSettings.id,
      languageId: item.languageId,
      data: item.data,
    });

    console.log(`${result}: site_settings ${item.label}`);
  }
}

async function seedHomepage(languages) {
  console.log("\n--- Homepage ---");

  const homepage = await getSingleton("homepage");

  if (!homepage?.id) {
    throw new Error("homepage belum memiliki ID. Buka Homepage di Directus dan Save sekali.");
  }

  const idContent = {
    hero_eyebrow: "MANAJEMEN KREDIT TERINTEGRASI",
    hero_title: "Manajemen kredit. Dirancang untuk kinerja.",
    hero_description:
      "Solusi terintegrasi untuk pengelolaan kredit, pemulihan, strategi portofolio, dan penagihan bagi institusi keuangan.",

    hero_primary_cta_label: "Jelajahi Solusi",
    hero_primary_cta_url: "/solutions",

    hero_secondary_cta_label: "Hubungi Kami",
    hero_secondary_cta_url: "/contact",

    capabilities_eyebrow: "SKALA & KAPABILITAS",
    capabilities_title:
      "Kapabilitas yang dibangun untuk menjalankan operasional kredit dalam skala besar.",
    capabilities_description:
      "Greatinco menggabungkan sumber daya manusia, proses, teknologi, analitik, dan tata kelola dalam satu model operasional terintegrasi.",

    solutions_eyebrow: "SOLUSI KAMI",
    solutions_title: "Solusi terintegrasi di setiap tahap pengelolaan kredit.",
    solutions_description:
      "Setiap solusi dirancang untuk mendukung institusi keuangan dalam meningkatkan kontrol, efisiensi, dan hasil pemulihan.",

    governance_eyebrow: "TATA KELOLA & KEPERCAYAAN",
    governance_title: "Kepercayaan dibangun melalui tata kelola dan standar yang konsisten.",
    governance_description:
      "Greatinco menempatkan keamanan informasi, kualitas operasional, kepatuhan, dan pengembangan profesional sebagai fondasi dalam setiap proses pengelolaan kredit.",

    activities_eyebrow: "AKTIVITAS GREATINCO",
    activities_title:
      "Budaya kerja yang dibangun melalui kolaborasi, pembelajaran, dan kebersamaan.",
    activities_description:
      "Kami membangun lingkungan kerja yang mendukung pengembangan kompetensi, kolaborasi, dan kinerja tim.",

    cta_eyebrow: "MULAI PERCAKAPAN",
    cta_title: "Perkuat strategi pengelolaan kredit bersama Greatinco.",
    cta_description:
      "Diskusikan kebutuhan portofolio, operasional penagihan, strategi pemulihan, maupun kebutuhan tenaga collection bersama tim kami.",
    cta_button_label: "Hubungi Tim Kami",
    cta_button_url: "/contact",

    seo_title: "Greatinco | Manajemen Kredit & Asset Servicing",
    seo_description:
      "Greatinco menyediakan solusi manajemen kredit, collection, recovery, field collection dan strategi portofolio bagi institusi keuangan.",
  };

  const enContent = {
    hero_eyebrow: "INTEGRATED CREDIT MANAGEMENT",
    hero_title: "Credit management. Built for performance.",
    hero_description:
      "Integrated solutions for credit management, recovery, portfolio strategy and collection operations for financial institutions.",

    hero_primary_cta_label: "Explore Solutions",
    hero_primary_cta_url: "/solutions",

    hero_secondary_cta_label: "Contact Us",
    hero_secondary_cta_url: "/contact",

    capabilities_eyebrow: "SCALE & CAPABILITIES",
    capabilities_title: "Capabilities built to operate credit portfolios at scale.",
    capabilities_description:
      "Greatinco combines people, process, technology, analytics and governance within one integrated operating model.",

    solutions_eyebrow: "OUR SOLUTIONS",
    solutions_title: "Integrated solutions across the credit management lifecycle.",
    solutions_description:
      "Each solution is designed to help financial institutions improve control, efficiency and recovery outcomes.",

    governance_eyebrow: "GOVERNANCE & TRUST",
    governance_title: "Trust is built through consistent governance and standards.",
    governance_description:
      "Greatinco places information security, operational quality, compliance and professional development at the foundation of every credit management process.",

    activities_eyebrow: "LIFE AT GREATINCO",
    activities_title:
      "A working culture built through collaboration, learning and shared experiences.",
    activities_description:
      "We foster an environment that supports capability development, collaboration and team performance.",

    cta_eyebrow: "START A CONVERSATION",
    cta_title: "Strengthen your credit management strategy with Greatinco.",
    cta_description:
      "Discuss your portfolio, collection operations, recovery strategy or collection workforce requirements with our team.",
    cta_button_label: "Talk to Our Team",
    cta_button_url: "/contact",

    seo_title: "Greatinco | Credit Management & Asset Servicing",
    seo_description:
      "Greatinco provides credit management, collection, recovery, field collection and portfolio strategy solutions for financial institutions.",
  };

  const rows = [
    {
      languageId: languages.id.id,
      label: "ID",
      data: idContent,
    },
    {
      languageId: languages.en.id,
      label: "EN",
      data: enContent,
    },
  ];

  for (const row of rows) {
    const result = await upsertTranslation({
      collection: "homepage_translations",
      parentField: "homepage_id",
      parentId: homepage.id,
      languageId: row.languageId,
      data: row.data,
    });

    console.log(`${result}: homepage ${row.label}`);
  }
}

async function seedCertifications(languages) {
  console.log("\n--- Certifications ---");

  const certifications = await getAll("certifications");

  const descriptions = {
    AFPI: {
      id: "Asosiasi industri yang mendukung tata kelola dan praktik di sektor fintech lending Indonesia.",
      en: "Industry association supporting governance and practices within Indonesia's fintech lending sector.",
    },

    "ISO 27001": {
      id: "Standar sistem manajemen keamanan informasi.",
      en: "Information security management system standard.",
    },

    "ISO 9001": {
      id: "Standar sistem manajemen mutu.",
      en: "Quality management system standard.",
    },

    LSPPI: {
      id: "Sertifikasi dan pengembangan kompetensi profesional di industri pembiayaan.",
      en: "Professional competency certification and development within the financing industry.",
    },
  };

  for (const certification of certifications) {
    const text = descriptions[certification.name];

    if (!text) {
      console.log(`skip unknown certification: ${certification.name}`);
      continue;
    }

    const rows = [
      {
        languageId: languages.id.id,
        label: "ID",
        description: text.id,
      },
      {
        languageId: languages.en.id,
        label: "EN",
        description: text.en,
      },
    ];

    for (const row of rows) {
      const result = await upsertTranslation({
        collection: "certifications_translations",
        parentField: "certifications_id",
        parentId: certification.id,
        languageId: row.languageId,
        data: {
          description: row.description,
        },
      });

      console.log(`${result}: ${certification.name} ${row.label}`);
    }
  }
}

async function seedNavigation(languages) {
  console.log("\n--- Navigation ---");

  const navigation = await getAll("navigation");

  const labels = {
    "/company": {
      id: "Perusahaan",
      en: "Company",
    },

    "/solutions": {
      id: "Solusi",
      en: "Solutions",
    },

    "/activities": {
      id: "Aktivitas",
      en: "Activities",
    },

    "/career": {
      id: "Karier",
      en: "Careers",
    },

    "/contact": {
      id: "Kontak",
      en: "Contact",
    },
  };

  for (const item of navigation) {
    const labelsForItem = labels[item.url];

    if (!labelsForItem) {
      console.log(`skip navigation ${item.location} ${item.url}`);
      continue;
    }

    const rows = [
      {
        languageId: languages.id.id,
        locale: "ID",
        label: labelsForItem.id,
      },
      {
        languageId: languages.en.id,
        locale: "EN",
        label: labelsForItem.en,
      },
    ];

    for (const row of rows) {
      const result = await upsertTranslation({
        collection: "navigation_translations",
        parentField: "navigation_id",
        parentId: item.id,
        languageId: row.languageId,
        data: {
          label: row.label,
        },
      });

      console.log(`${result}: ${item.location} ${item.url} ${row.locale}`);
    }
  }
}

async function main() {
  console.log("=================================");
  console.log(" GREATINCO CORE TRANSLATION SEED ");
  console.log("=================================");

  const languages = await getLanguages();

  console.log(`ID language: ${languages.id.id}`);
  console.log(`EN language: ${languages.en.id}`);

  await seedSiteSettings(languages);
  await seedHomepage(languages);
  await seedCertifications(languages);
  await seedNavigation(languages);

  console.log("");
  console.log("=================================");
  console.log(" CORE TRANSLATIONS SEED COMPLETE ");
  console.log("=================================");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

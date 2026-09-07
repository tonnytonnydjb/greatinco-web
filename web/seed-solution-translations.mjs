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

async function getAll(collection) {
  const response = await request(`/items/${collection}?limit=-1`);
  return response?.data ?? [];
}

async function create(collection, data) {
  return request(`/items/${collection}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

const content = {
  "credit-servicing-recovery": {
    id: {
      title: "Credit Servicing & Recovery",
      short_description:
        "Pengelolaan kredit dan pemulihan yang dirancang untuk meningkatkan kualitas engagement, produktivitas operasional, dan hasil recovery.",
      hero_title:
        "Pengelolaan kredit dan pemulihan yang terstruktur untuk hasil yang lebih optimal.",
      hero_description:
        "Greatinco mendukung institusi keuangan dalam mengelola siklus kredit melalui proses servicing, engagement, collection, dan recovery yang terukur.",
      content: `
        <h2>Pengelolaan kredit yang terintegrasi</h2>
        <p>Greatinco menyediakan layanan credit servicing dan recovery yang menggabungkan proses operasional, sumber daya manusia, teknologi, analitik, dan quality monitoring.</p>
        <p>Pendekatan kami dirancang untuk membantu institusi keuangan meningkatkan konsistensi proses, efektivitas engagement, produktivitas operasional, serta hasil pemulihan portofolio.</p>
      `,
      seo_title: "Credit Servicing & Recovery | Greatinco",
      seo_description:
        "Solusi credit servicing dan recovery Greatinco untuk mendukung pengelolaan kredit, collection, dan pemulihan portofolio institusi keuangan.",
    },
    en: {
      title: "Credit Servicing & Recovery",
      short_description:
        "Credit servicing and recovery designed to improve customer engagement, operational productivity and recovery outcomes.",
      hero_title: "Structured credit servicing and recovery for stronger portfolio outcomes.",
      hero_description:
        "Greatinco supports financial institutions across the credit lifecycle through measurable servicing, engagement, collection and recovery processes.",
      content: `
        <h2>Integrated credit management</h2>
        <p>Greatinco provides credit servicing and recovery capabilities combining operations, people, technology, analytics and quality monitoring.</p>
        <p>Our approach is designed to help financial institutions improve process consistency, engagement effectiveness, operational productivity and portfolio recovery outcomes.</p>
      `,
      seo_title: "Credit Servicing & Recovery | Greatinco",
      seo_description:
        "Greatinco credit servicing and recovery solutions supporting credit management, collection and portfolio recovery for financial institutions.",
    },
  },

  "desk-collection": {
    id: {
      title: "Desk Collection",
      short_description:
        "Strategi penagihan berbasis data dengan pengelolaan agent, quality monitoring, dan pendekatan komunikasi yang terukur.",
      hero_title:
        "Desk collection berbasis data untuk meningkatkan produktivitas dan kualitas engagement.",
      hero_description:
        "Operasional desk collection Greatinco menggabungkan segmentasi, strategi komunikasi, workforce management, monitoring kualitas, dan analitik.",
      content: `
        <h2>Desk collection yang terukur</h2>
        <p>Greatinco menjalankan operasional desk collection dengan pendekatan berbasis segmentasi dan strategi yang disesuaikan dengan karakteristik portofolio.</p>
        <p>Pengelolaan agent, quality assurance, monitoring produktivitas, dan analitik digunakan untuk menjaga efektivitas serta konsistensi proses penagihan.</p>
      `,
      seo_title: "Desk Collection | Greatinco",
      seo_description:
        "Layanan desk collection Greatinco dengan strategi berbasis data, pengelolaan agent, quality monitoring dan analitik.",
    },
    en: {
      title: "Desk Collection",
      short_description:
        "Data-driven collection strategies with structured agent management, quality monitoring and controlled communication.",
      hero_title: "Data-driven desk collection designed for productivity and engagement quality.",
      hero_description:
        "Greatinco combines segmentation, communication strategy, workforce management, quality monitoring and analytics within its desk collection operations.",
      content: `
        <h2>Measurable desk collection operations</h2>
        <p>Greatinco delivers desk collection operations using segmentation and strategies aligned with portfolio characteristics.</p>
        <p>Agent management, quality assurance, productivity monitoring and analytics support consistent and effective collection processes.</p>
      `,
      seo_title: "Desk Collection | Greatinco",
      seo_description:
        "Greatinco desk collection services combining data-driven strategies, agent management, quality monitoring and analytics.",
    },
  },

  "field-collection": {
    id: {
      title: "Field Collection",
      short_description:
        "Kapabilitas field collection dengan pengelolaan wilayah, kunjungan, monitoring, dan kontrol operasional.",
      hero_title: "Field collection dengan kontrol operasional dan cakupan yang terukur.",
      hero_description:
        "Greatinco mendukung aktivitas field collection melalui pengelolaan wilayah, perencanaan kunjungan, monitoring aktivitas, dan pengawasan operasional.",
      content: `
        <h2>Field collection dengan pengelolaan terstruktur</h2>
        <p>Operasional field collection Greatinco dirancang untuk mendukung proses kunjungan dan engagement secara terukur di berbagai wilayah.</p>
        <p>Territory management, monitoring kunjungan, produktivitas field collector dan kontrol operasional menjadi bagian dari proses yang terintegrasi.</p>
      `,
      seo_title: "Field Collection | Greatinco",
      seo_description:
        "Layanan field collection Greatinco dengan territory management, monitoring kunjungan dan kontrol operasional.",
    },
    en: {
      title: "Field Collection",
      short_description:
        "Field collection capabilities supported by territory management, visit monitoring and operational controls.",
      hero_title: "Controlled and measurable field collection operations.",
      hero_description:
        "Greatinco supports field collection through territory management, visit planning, activity monitoring and operational oversight.",
      content: `
        <h2>Structured field collection</h2>
        <p>Greatinco field collection operations are designed to support measurable customer visits and engagement across multiple territories.</p>
        <p>Territory management, visit monitoring, field collector productivity and operational controls form part of an integrated process.</p>
      `,
      seo_title: "Field Collection | Greatinco",
      seo_description:
        "Greatinco field collection services supported by territory management, visit monitoring and operational controls.",
    },
  },

  "collection-manpower": {
    id: {
      title: "Collection Manpower",
      short_description:
        "Penyediaan tenaga operasional collection yang terstruktur, terlatih, dan terukur sesuai kebutuhan institusi.",
      hero_title:
        "Tenaga collection yang disiapkan untuk mendukung kebutuhan operasional institusi.",
      hero_description:
        "Greatinco menyediakan dukungan manpower collection dengan proses rekrutmen, pelatihan, pengelolaan kinerja, dan monitoring yang terstruktur.",
      content: `
        <h2>Collection manpower yang terkelola</h2>
        <p>Greatinco membantu institusi memperoleh sumber daya collection yang sesuai dengan kebutuhan operasional dan karakteristik portofolio.</p>
        <p>Proses mencakup sourcing, pelatihan, monitoring produktivitas, quality management, serta pengembangan kompetensi secara berkelanjutan.</p>
      `,
      seo_title: "Collection Manpower | Greatinco",
      seo_description:
        "Solusi collection manpower Greatinco dengan proses rekrutmen, pelatihan, performance management dan monitoring.",
    },
    en: {
      title: "Collection Manpower",
      short_description:
        "Structured and trained collection manpower aligned with institutional operating requirements.",
      hero_title: "Collection manpower designed to support institutional operating requirements.",
      hero_description:
        "Greatinco provides collection workforce support through structured recruitment, training, performance management and monitoring.",
      content: `
        <h2>Managed collection workforce</h2>
        <p>Greatinco helps institutions access collection resources aligned with operational requirements and portfolio characteristics.</p>
        <p>Our process covers sourcing, training, productivity monitoring, quality management and continuous capability development.</p>
      `,
      seo_title: "Collection Manpower | Greatinco",
      seo_description:
        "Greatinco collection manpower solutions covering recruitment, training, performance management and operational monitoring.",
    },
  },

  "portfolio-strategy-investment": {
    id: {
      title: "Portfolio Strategy & Investment",
      short_description:
        "Analisis portofolio, strategi pemulihan, dan pendekatan investasi untuk mendukung keputusan berbasis risiko dan nilai.",
      hero_title: "Strategi portofolio untuk mendukung keputusan berbasis risiko dan nilai.",
      hero_description:
        "Greatinco menggabungkan analisis portofolio, strategi recovery, dan perspektif investasi untuk membantu optimalisasi nilai aset kredit.",
      content: `
        <h2>Strategi berbasis pemahaman portofolio</h2>
        <p>Greatinco mendukung evaluasi portofolio melalui analisis karakteristik aset, segmentasi, strategi recovery dan pemodelan potensi nilai.</p>
        <p>Pendekatan ini membantu mendukung keputusan pengelolaan maupun investasi portofolio berdasarkan risiko, performa dan potensi pemulihan.</p>
      `,
      seo_title: "Portfolio Strategy & Investment | Greatinco",
      seo_description:
        "Analisis portofolio, strategi recovery dan pendekatan investasi Greatinco untuk mendukung optimalisasi nilai aset kredit.",
    },
    en: {
      title: "Portfolio Strategy & Investment",
      short_description:
        "Portfolio analytics, recovery strategies and investment approaches supporting risk-based and value-driven decisions.",
      hero_title: "Portfolio strategies supporting risk-based and value-driven decisions.",
      hero_description:
        "Greatinco combines portfolio analytics, recovery strategies and an investment perspective to support credit asset value optimization.",
      content: `
        <h2>Portfolio-driven strategy</h2>
        <p>Greatinco supports portfolio evaluation through asset analysis, segmentation, recovery strategies and value potential modelling.</p>
        <p>This approach supports portfolio management and investment decisions based on risk, performance and recovery potential.</p>
      `,
      seo_title: "Portfolio Strategy & Investment | Greatinco",
      seo_description:
        "Greatinco portfolio analytics, recovery strategies and investment approaches supporting credit asset value optimization.",
    },
  },
};

async function main() {
  console.log("=== SOLUTION TRANSLATION SEED ===");

  const languages = await getAll("languages");
  const solutions = await getAll("solutions");
  const existingTranslations = await getAll("solutions_translations");

  const idLanguage = languages.find((row) => row.code === "id-ID");
  const enLanguage = languages.find((row) => row.code === "en-US");

  if (!idLanguage || !enLanguage) {
    throw new Error("Language id-ID / en-US tidak ditemukan");
  }

  console.log(`id-ID language id: ${idLanguage.id}`);
  console.log(`en-US language id: ${enLanguage.id}`);

  for (const solution of solutions) {
    const entry = content[solution.slug];

    if (!entry) {
      console.log(`SKIP unknown slug: ${solution.slug}`);
      continue;
    }

    const translations = [
      {
        language: idLanguage.id,
        payload: entry.id,
        label: "ID",
      },
      {
        language: enLanguage.id,
        payload: entry.en,
        label: "EN",
      },
    ];

    for (const translation of translations) {
      const exists = existingTranslations.some(
        (row) => row.solutions_id === solution.id && row.languages_id === translation.language,
      );

      if (exists) {
        console.log(`SKIP ${solution.slug} ${translation.label} already exists`);
        continue;
      }

      await create("solutions_translations", {
        solutions_id: solution.id,
        languages_id: translation.language,
        ...translation.payload,
      });

      console.log(`+ ${solution.slug} ${translation.label}`);
    }
  }

  console.log("");
  console.log("Solution translations selesai.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

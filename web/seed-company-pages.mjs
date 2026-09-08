const BASE = process.env.DIRECTUS_URL || "http://127.0.0.1:8055";

const TOKEN = process.env.DIRECTUS_SEED_TOKEN;

if (!TOKEN) {
  throw new Error("DIRECTUS_SEED_TOKEN belum tersedia");
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

async function getAll(collection, fields = "*") {
  const result = await api(`/items/${collection}?fields=${encodeURIComponent(fields)}&limit=-1`);

  return result?.data ?? [];
}

async function create(collection, data) {
  const result = await api(`/items/${collection}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return result.data;
}

async function update(collection, id, data) {
  const result = await api(`/items/${collection}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return result.data;
}

const pages = [
  {
    slug: "company",
    sort: 1,

    id: {
      eyebrow: "TENTANG GREATINCO",
      title: "Greatinco",
      hero_title: "Mitra strategis dalam pengelolaan kredit dan pemulihan portofolio.",
      hero_description:
        "Greatinco membantu institusi keuangan mengelola siklus kredit melalui pendekatan yang terstruktur, berorientasi hasil, dan didukung kapabilitas operasional serta teknologi.",
      intro:
        "Kami membangun solusi pengelolaan kredit yang menghubungkan strategi portofolio, servicing, collection, recovery, dan operational execution dalam satu pendekatan yang terintegrasi.",
      content:
        "Greatinco berfokus pada pengelolaan kredit dan portofolio bagi institusi keuangan. Pendekatan kami dirancang untuk membantu klien meningkatkan efektivitas operasional, kualitas eksekusi, dan hasil pemulihan melalui kombinasi people, process, technology, analytics, dan governance.\n\nKami percaya bahwa pengelolaan kredit yang efektif membutuhkan lebih dari sekadar aktivitas penagihan. Dibutuhkan strategi yang tepat, disiplin operasional, pengawasan kualitas, pengelolaan risiko, dan kemampuan beradaptasi terhadap karakteristik setiap portofolio.",
      seo_title: "Tentang Greatinco | Manajemen Kredit & Recovery",
      seo_description:
        "Pelajari Greatinco dan pendekatan terintegrasi kami dalam credit management, collection, recovery, dan portfolio servicing.",
    },

    en: {
      eyebrow: "ABOUT GREATINCO",
      title: "Greatinco",
      hero_title: "A strategic partner in credit management and portfolio recovery.",
      hero_description:
        "Greatinco helps financial institutions manage the credit lifecycle through a structured, outcome-oriented approach supported by operational and technology capabilities.",
      intro:
        "We build integrated credit management solutions connecting portfolio strategy, servicing, collection, recovery and operational execution.",
      content:
        "Greatinco focuses on credit and portfolio management for financial institutions. Our approach is designed to help clients improve operational effectiveness, execution quality and recovery outcomes through a combination of people, process, technology, analytics and governance.\n\nWe believe effective credit management requires more than collection activity alone. It requires the right strategy, disciplined operations, quality oversight, risk management and the ability to adapt to the characteristics of each portfolio.",
      seo_title: "About Greatinco | Credit Management & Recovery",
      seo_description:
        "Learn about Greatinco and our integrated approach to credit management, collection, recovery and portfolio servicing.",
    },
  },

  {
    slug: "organization",
    sort: 2,

    id: {
      eyebrow: "ORGANISASI",
      title: "Organisasi Greatinco",
      hero_title: "Struktur yang dirancang untuk mendukung eksekusi dan pertumbuhan.",
      hero_description:
        "Struktur organisasi Greatinco menghubungkan fungsi bisnis, operasi, teknologi, quality, risk, dan support untuk memastikan pengelolaan portofolio berjalan secara konsisten.",
      intro:
        "Kami membangun organisasi yang menempatkan akuntabilitas, kolaborasi lintas fungsi, dan kecepatan pengambilan keputusan sebagai bagian penting dari operational excellence.",
      content:
        "Setiap fungsi memiliki peran yang jelas dalam mendukung siklus pengelolaan kredit. Business dan portfolio management berfokus pada kebutuhan klien dan strategi portofolio, sementara operation menjalankan proses servicing dan collection secara terukur.\n\nTechnology, analytics, quality assurance, risk, compliance, dan fungsi pendukung lainnya bekerja secara terintegrasi untuk memperkuat kontrol, visibilitas, dan konsistensi eksekusi.",
      seo_title: "Organisasi Greatinco | Struktur & Kapabilitas",
      seo_description:
        "Struktur organisasi Greatinco mendukung eksekusi credit management melalui kolaborasi lintas fungsi dan governance yang terintegrasi.",
    },

    en: {
      eyebrow: "ORGANIZATION",
      title: "Greatinco Organization",
      hero_title: "A structure designed to support execution and growth.",
      hero_description:
        "Greatinco's organization connects business, operations, technology, quality, risk and support functions to enable consistent portfolio management.",
      intro:
        "We build an organization centered on accountability, cross-functional collaboration and effective decision-making.",
      content:
        "Each function plays a clear role in supporting the credit management lifecycle. Business and portfolio management focus on client requirements and portfolio strategy, while operations execute servicing and collection processes in a measurable manner.\n\nTechnology, analytics, quality assurance, risk, compliance and supporting functions work together to strengthen control, visibility and execution consistency.",
      seo_title: "Greatinco Organization | Structure & Capabilities",
      seo_description:
        "Greatinco's organizational structure supports credit management execution through cross-functional collaboration and integrated governance.",
    },
  },

  {
    slug: "governance",
    sort: 3,

    id: {
      eyebrow: "TATA KELOLA",
      title: "Governance & Quality",
      hero_title: "Disiplin operasional yang diperkuat oleh governance dan quality control.",
      hero_description:
        "Greatinco menerapkan pendekatan governance yang mendukung pengelolaan risiko, kualitas layanan, keamanan informasi, dan konsistensi proses.",
      intro:
        "Governance menjadi bagian dari cara kami merancang dan menjalankan operasi, bukan sekadar fungsi pengawasan di akhir proses.",
      content:
        "Kami membangun mekanisme kontrol yang mencakup standard operating procedure, quality monitoring, audit trail, escalation process, access control, data protection, dan continuous improvement.\n\nPendekatan ini membantu memastikan bahwa proses operasional tidak hanya mengejar hasil, tetapi juga mempertimbangkan kualitas, kepatuhan, keamanan, dan keberlanjutan hubungan dengan klien maupun customer.",
      seo_title: "Governance & Quality | Greatinco",
      seo_description:
        "Pendekatan governance Greatinco untuk quality control, risk management, security, compliance, dan operational consistency.",
    },

    en: {
      eyebrow: "GOVERNANCE",
      title: "Governance & Quality",
      hero_title: "Operational discipline strengthened by governance and quality control.",
      hero_description:
        "Greatinco applies a governance approach supporting risk management, service quality, information security and process consistency.",
      intro:
        "Governance is embedded in how we design and operate our services rather than treated solely as an end-stage oversight function.",
      content:
        "We build control mechanisms covering standard operating procedures, quality monitoring, audit trails, escalation processes, access control, data protection and continuous improvement.\n\nThis approach helps ensure operations pursue outcomes while maintaining quality, compliance, security and sustainable relationships with clients and customers.",
      seo_title: "Governance & Quality | Greatinco",
      seo_description:
        "Greatinco's governance approach to quality control, risk management, security, compliance and operational consistency.",
    },
  },
];

async function main() {
  const languages = await getAll("languages", "id,code");

  const idLanguage = languages.find((item) => item.code === "id-ID");

  const enLanguage = languages.find((item) => item.code === "en-US");

  if (!idLanguage || !enLanguage) {
    throw new Error("Language id-ID / en-US tidak ditemukan");
  }

  let existingPages = await getAll("company_pages", "id,slug,status,sort");

  let existingTranslations = await getAll(
    "company_pages_translations",
    "id,company_pages_id,languages_id",
  );

  for (const page of pages) {
    let record = existingPages.find((item) => item.slug === page.slug);

    if (!record) {
      record = await create("company_pages", {
        slug: page.slug,
        status: "published",
        sort: page.sort,
      });

      existingPages.push(record);

      console.log(`created page: ${page.slug}`);
    } else {
      await update("company_pages", record.id, {
        status: "published",
        sort: page.sort,
      });

      console.log(`updated page: ${page.slug}`);
    }

    for (const translation of [
      {
        language: idLanguage.id,
        content: page.id,
        label: "ID",
      },
      {
        language: enLanguage.id,
        content: page.en,
        label: "EN",
      },
    ]) {
      const existing = existingTranslations.find(
        (item) => item.company_pages_id === record.id && item.languages_id === translation.language,
      );

      if (existing) {
        await update("company_pages_translations", existing.id, translation.content);

        console.log(`  updated ${translation.label}`);
      } else {
        const created = await create("company_pages_translations", {
          company_pages_id: record.id,
          languages_id: translation.language,
          ...translation.content,
        });

        existingTranslations.push(created);

        console.log(`  created ${translation.label}`);
      }
    }
  }

  console.log("\nCompany page seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

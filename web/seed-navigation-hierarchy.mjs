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

async function createItem(collection, payload) {
  const result = await api(`/items/${collection}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result.data;
}

async function updateItem(collection, id, payload) {
  const result = await api(`/items/${collection}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return result.data;
}

const headerTree = [
  {
    key: "company",
    location: "header",
    url: "/company",
    sort: 1,
    id: "Perusahaan",
    en: "Company",
    children: [
      {
        url: "/company",
        sort: 1,
        id: "Tentang Greatinco",
        en: "About Greatinco",
      },
      {
        url: "/company/leadership",
        sort: 2,
        id: "Tim & Kepemimpinan",
        en: "Leadership",
      },
      {
        url: "/company/organization",
        sort: 3,
        id: "Organisasi",
        en: "Organization",
      },
      {
        url: "/company/governance",
        sort: 4,
        id: "Tata Kelola",
        en: "Governance",
      },
    ],
  },
  {
    key: "solutions",
    location: "header",
    url: "/solutions",
    sort: 2,
    id: "Solusi",
    en: "Solutions",
    children: [
      {
        url: "/solutions/credit-servicing-recovery",
        sort: 1,
        id: "Credit Servicing & Recovery",
        en: "Credit Servicing & Recovery",
      },
      {
        url: "/solutions/desk-collection",
        sort: 2,
        id: "Desk Collection",
        en: "Desk Collection",
      },
      {
        url: "/solutions/field-collection",
        sort: 3,
        id: "Field Collection",
        en: "Field Collection",
      },
      {
        url: "/solutions/collection-manpower",
        sort: 4,
        id: "Collection Manpower",
        en: "Collection Manpower",
      },
      {
        url: "/solutions/portfolio-strategy-investment",
        sort: 5,
        id: "Strategi Portofolio",
        en: "Portfolio Strategy",
      },
    ],
  },
  {
    key: "activities",
    location: "header",
    url: "/activities",
    sort: 3,
    id: "Aktivitas",
    en: "Activities",
    children: [
      {
        url: "/activities",
        sort: 1,
        id: "Aktivitas Greatinco",
        en: "Greatinco Activities",
      },
      {
        url: "/activities/gallery",
        sort: 2,
        id: "Galeri",
        en: "Gallery",
      },
    ],
  },
  {
    key: "careers",
    location: "header",
    url: "/careers",
    sort: 4,
    id: "Karier",
    en: "Careers",
    children: [],
  },
  {
    key: "contact",
    location: "header",
    url: "/contact",
    sort: 5,
    id: "Kontak",
    en: "Contact",
    children: [],
  },
];

const footerTree = [
  {
    key: "footer-company",
    location: "footer",
    url: null,
    sort: 1,
    id: "Perusahaan",
    en: "Company",
    children: [
      {
        url: "/company",
        sort: 1,
        id: "Tentang Greatinco",
        en: "About Greatinco",
      },
      {
        url: "/company/leadership",
        sort: 2,
        id: "Tim & Kepemimpinan",
        en: "Leadership",
      },
      {
        url: "/careers",
        sort: 3,
        id: "Karier",
        en: "Careers",
      },
    ],
  },
  {
    key: "footer-solutions",
    location: "footer",
    url: null,
    sort: 2,
    id: "Solusi",
    en: "Solutions",
    children: [
      {
        url: "/solutions/credit-servicing-recovery",
        sort: 1,
        id: "Credit Servicing",
        en: "Credit Servicing",
      },
      {
        url: "/solutions/desk-collection",
        sort: 2,
        id: "Desk Collection",
        en: "Desk Collection",
      },
      {
        url: "/solutions/field-collection",
        sort: 3,
        id: "Field Collection",
        en: "Field Collection",
      },
      {
        url: "/solutions/portfolio-strategy-investment",
        sort: 4,
        id: "Strategi Portofolio",
        en: "Portfolio Strategy",
      },
    ],
  },
  {
    key: "footer-information",
    location: "footer",
    url: null,
    sort: 3,
    id: "Informasi",
    en: "Information",
    children: [
      {
        url: "/activities",
        sort: 1,
        id: "Aktivitas",
        en: "Activities",
      },
      {
        url: "/contact",
        sort: 2,
        id: "Hubungi Kami",
        en: "Contact Us",
      },
      {
        url: "/privacy",
        sort: 3,
        id: "Kebijakan Privasi",
        en: "Privacy Policy",
      },
      {
        url: "/terms",
        sort: 4,
        id: "Ketentuan Layanan",
        en: "Terms of Service",
      },
    ],
  },
];

function parentId(value) {
  if (value == null) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "object" && typeof value.id === "number") {
    return value.id;
  }

  return null;
}

async function main() {
  const languages = await getAll("languages", "id,code");

  const languageId = languages.find((item) => item.code === "id-ID")?.id;

  const languageEn = languages.find((item) => item.code === "en-US")?.id;

  if (!languageId || !languageEn) {
    throw new Error("Language id-ID / en-US tidak ditemukan");
  }

  let navigation = await getAll(
    "navigation",
    "id,location,url,parent,status,sort,open_in_new_tab,is_external",
  );

  let translations = await getAll("navigation_translations", "id,navigation_id,languages_id,label");

  function findRoot(location, url) {
    return navigation.find(
      (item) => item.location === location && item.url === url && parentId(item.parent) === null,
    );
  }

  function findChild(location, url, parent) {
    return navigation.find(
      (item) => item.location === location && item.url === url && parentId(item.parent) === parent,
    );
  }

  async function upsertTranslation(navigationId, languagesId, label) {
    const existing = translations.find(
      (item) => item.navigation_id === navigationId && item.languages_id === languagesId,
    );

    if (existing) {
      await updateItem("navigation_translations", existing.id, {
        label,
      });

      existing.label = label;

      return;
    }

    const created = await createItem("navigation_translations", {
      navigation_id: navigationId,
      languages_id: languagesId,
      label,
    });

    translations.push(created);
  }

  async function upsertRoot(item) {
    let existing = findRoot(item.location, item.url);

    /*
     * Footer group parents use null URL.
     * Multiple null roots are possible, so identify
     * them using their translated label when needed.
     */
    if (item.location === "footer" && item.url === null) {
      existing = navigation.find((nav) => {
        if (nav.location !== "footer" || nav.url !== null || parentId(nav.parent) !== null) {
          return false;
        }

        const translation = translations.find(
          (tr) => tr.navigation_id === nav.id && tr.languages_id === languageId,
        );

        return translation?.label === item.id;
      });
    }

    if (!existing) {
      existing = await createItem("navigation", {
        location: item.location,
        url: item.url,
        parent: null,
        status: "published",
        sort: item.sort,
        open_in_new_tab: false,
        is_external: false,
      });

      navigation.push(existing);

      console.log(`created root: ${item.location} / ${item.id}`);
    } else {
      await updateItem("navigation", existing.id, {
        location: item.location,
        url: item.url,
        parent: null,
        status: "published",
        sort: item.sort,
        open_in_new_tab: false,
        is_external: false,
      });

      console.log(`updated root: ${item.location} / ${item.id}`);
    }

    await upsertTranslation(existing.id, languageId, item.id);

    await upsertTranslation(existing.id, languageEn, item.en);

    return existing;
  }

  async function upsertChild(parent, location, child) {
    let existing = findChild(location, child.url, parent.id);

    /*
     * Reuse an existing flat footer item when
     * possible instead of creating duplicates.
     */
    if (!existing && location === "footer") {
      existing = navigation.find(
        (item) =>
          item.location === location && item.url === child.url && parentId(item.parent) === null,
      );
    }

    if (!existing) {
      existing = await createItem("navigation", {
        location,
        url: child.url,
        parent: parent.id,
        status: "published",
        sort: child.sort,
        open_in_new_tab: false,
        is_external: false,
      });

      navigation.push(existing);

      console.log(`  created child: ${child.id}`);
    } else {
      await updateItem("navigation", existing.id, {
        location,
        url: child.url,
        parent: parent.id,
        status: "published",
        sort: child.sort,
        open_in_new_tab: false,
        is_external: false,
      });

      existing.parent = parent.id;

      console.log(`  updated child: ${child.id}`);
    }

    await upsertTranslation(existing.id, languageId, child.id);

    await upsertTranslation(existing.id, languageEn, child.en);
  }

  for (const tree of [headerTree, footerTree]) {
    for (const item of tree) {
      const root = await upsertRoot(item);

      for (const child of item.children) {
        await upsertChild(root, item.location, child);
      }
    }
  }

  console.log("\nNavigation hierarchy seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

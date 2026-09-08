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

async function exists(path) {
  const response = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    const text = await response.text();

    throw new Error(`${response.status} ${response.statusText}\n${path}\n${text}`);
  }

  return true;
}

async function createField(collection, field, type, extra = {}) {
  if (await exists(`/fields/${collection}/${field}`)) {
    console.log(`skip field ${collection}.${field}`);
    return;
  }

  await api(`/fields/${collection}`, {
    method: "POST",
    body: JSON.stringify({
      field,
      type,
      ...extra,
    }),
  });

  console.log(`created field ${collection}.${field}`);
}

async function main() {
  if (!(await exists("/collections/company_pages"))) {
    await api("/collections", {
      method: "POST",
      body: JSON.stringify({
        collection: "company_pages",
        meta: {
          icon: "domain",
          note: "Corporate content pages",
          singleton: false,
          sort_field: "sort",
        },
        schema: {},
      }),
    });

    console.log("created collection company_pages");
  } else {
    console.log("skip collection company_pages");
  }

  await createField("company_pages", "id", "integer", {
    meta: {
      hidden: true,
      readonly: true,
      interface: "input",
    },
    schema: {
      is_primary_key: true,
      has_auto_increment: true,
    },
  });

  await createField("company_pages", "status", "string", {
    meta: {
      interface: "select-dropdown",
      options: {
        choices: [
          {
            text: "Draft",
            value: "draft",
          },
          {
            text: "Published",
            value: "published",
          },
          {
            text: "Archived",
            value: "archived",
          },
        ],
      },
    },
    schema: {
      default_value: "draft",
    },
  });

  await createField("company_pages", "sort", "integer", {
    meta: {
      interface: "input",
    },
  });

  await createField("company_pages", "slug", "string", {
    meta: {
      interface: "input",
      required: true,
    },
    schema: {
      is_unique: true,
    },
  });

  await createField("company_pages", "hero_image", "uuid", {
    meta: {
      interface: "file-image",
      special: ["file"],
    },
    schema: {
      foreign_key_table: "directus_files",
      foreign_key_column: "id",
    },
  });

  if (!(await exists("/collections/company_pages_translations"))) {
    await api("/collections", {
      method: "POST",
      body: JSON.stringify({
        collection: "company_pages_translations",
        meta: {
          icon: "translate",
          hidden: true,
        },
        schema: {},
      }),
    });

    console.log("created company_pages_translations");
  }

  await createField("company_pages_translations", "id", "integer", {
    meta: {
      hidden: true,
      readonly: true,
    },
    schema: {
      is_primary_key: true,
      has_auto_increment: true,
    },
  });

  await createField("company_pages_translations", "company_pages_id", "integer", {
    meta: {
      hidden: true,
    },
    schema: {
      foreign_key_table: "company_pages",
      foreign_key_column: "id",
    },
  });

  await createField("company_pages_translations", "languages_id", "integer", {
    meta: {
      hidden: true,
    },
    schema: {
      foreign_key_table: "languages",
      foreign_key_column: "id",
    },
  });

  const translationFields = [
    ["eyebrow", "string"],
    ["title", "string"],
    ["hero_title", "text"],
    ["hero_description", "text"],
    ["intro", "text"],
    ["content", "text"],
    ["seo_title", "string"],
    ["seo_description", "text"],
  ];

  for (const [field, type] of translationFields) {
    await createField("company_pages_translations", field, type, {
      meta: {
        interface: type === "text" ? "input-multiline" : "input",
      },
    });
  }

  /*
   * Create M2O/O2M relation.
   */
  const relations = await api("/relations/company_pages_translations");

  const hasRelation = relations.data?.some((relation) => relation.field === "company_pages_id");

  if (!hasRelation) {
    await api("/relations", {
      method: "POST",
      body: JSON.stringify({
        collection: "company_pages_translations",
        field: "company_pages_id",
        related_collection: "company_pages",
        meta: {
          one_field: "translations",
          sort_field: null,
        },
        schema: {
          on_delete: "CASCADE",
        },
      }),
    });

    console.log("created company page translation relation");
  }

  console.log("\nCompany pages schema ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

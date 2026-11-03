const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

export async function loadMedia(fetcher = fetch) {
  try {
    const response = await fetcher("assets/manifest.json?v=4");
    if (!response.ok) return { version: 1, assets: [] };
    const data = await response.json();
    return {
      ...data,
      assets: Array.isArray(data.assets)
        ? data.assets.filter(
            (a) =>
              a.id &&
              typeof a.path === "string" &&
              /^assets\/media\/[\w/.-]+$/.test(a.path) &&
              !a.path.includes(".."),
          )
        : [],
    };
  } catch {
    return { version: 1, assets: [] };
  }
}

export function createMediaLibrary(manifest) {
  const entries = manifest.assets || [];
  const byId = new Map(entries.map((a) => [a.id, a]));
  return {
    entries,
    get: (id) => byId.get(id),
    image(
      id,
      label = "",
      {
        className = "",
        width = 256,
        height = 256,
        eager = false,
        fallback = "assets/crown.svg",
      } = {},
    ) {
      const a = byId.get(id);
      return `<img class="media-art ${escapeHTML(className)}" src="${escapeHTML(a?.path || fallback)}" alt="${escapeHTML(label)}" width="${width}" height="${height}" loading="${eager ? "eager" : "lazy"}" decoding="async" ${eager ? 'fetchpriority="high"' : ""} data-media-id="${escapeHTML(id)}" data-media-fallback="${escapeHTML(fallback)}">`;
    },
    credits() {
      const grouped = new Map();
      for (const a of entries) {
        const key = `${a.author}|${a.license}|${a.sourceUrl}`;
        if (!grouped.has(key))
          grouped.set(key, {
            author: a.author,
            license: a.license,
            sourceUrl: a.sourceUrl,
            count: 0,
          });
        grouped.get(key).count++;
      }
      return [...grouped.values()];
    },
  };
}

export function settlementStage(buildings) {
  const total = buildings.reduce((sum, n) => sum + n, 0);
  return total >= 65
    ? {
        id: 2,
        name: "Столица рассвета",
        subtitle: "Башни, мастерские и знамёна нового королевства.",
      }
    : total >= 18
      ? {
          id: 1,
          name: "Укреплённое поселение",
          subtitle: "Каменные стены берегут огонь твоей династии.",
        }
      : {
          id: 0,
          name: "Лагерь у старого тракта",
          subtitle:
            "Первые очаги горят среди руин. Здесь начнётся твоя история.",
        };
}

export function settlementBuildings(buildings, definitions, stage) {
  const preferred = [
    "barracks",
    "farm",
    "sawmill",
    "market",
    "range",
    "smith",
    "stable",
    "academy",
    "spire",
    "observatory",
  ];
  const owned = definitions
    .map((b, i) => ({ id: b.id, count: buildings[i] }))
    .filter((b) => b.count > 0);
  if (!owned.length) return ["farm"]; // an unclaimed shelter marks the starting camp
  owned.sort(
    (a, b) =>
      (preferred.indexOf(a.id) < 0 ? 99 : preferred.indexOf(a.id)) -
      (preferred.indexOf(b.id) < 0 ? 99 : preferred.indexOf(b.id)),
  );
  const result = [],
    limit = [3, 6, 7][stage] || 3;
  for (let level = 0; result.length < limit; level++) {
    let added = false;
    for (const b of owned)
      if (b.count > level && result.length < limit) {
        result.push(b.id);
        added = true;
      }
    if (!added) break;
  }
  return result;
}

export function installImageFallbacks(document) {
  document.addEventListener(
    "error",
    (event) => {
      const img = event.target;
      if (
        img?.tagName !== "IMG" ||
        !img.dataset.mediaFallback ||
        img.dataset.fallbackApplied
      )
        return;
      img.dataset.fallbackApplied = "true";
      img.src = img.dataset.mediaFallback;
      img.classList.add("media-fallback");
    },
    true,
  );
}

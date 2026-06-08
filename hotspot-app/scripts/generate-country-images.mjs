const COUNTRIES = [
  [1, "Algeria"], [2, "Angola"], [3, "Benin"], [4, "Botswana"], [5, "Burkina Faso"],
  [6, "Burundi"], [7, "Cabo Verde"], [8, "Cameroon"], [9, "Central African Republic"],
  [10, "Chad"], [11, "Comoros"], [12, "Congo"], [13, "Côte d'Ivoire"],
  [14, "Democratic Republic of the Congo"], [15, "Djibouti"], [16, "Egypt"],
  [17, "Equatorial Guinea"], [18, "Eritrea"], [19, "Eswatini"], [20, "Ethiopia"],
  [21, "Gabon"], [22, "Gambia"], [23, "Ghana"], [24, "Guinea"], [25, "Guinea-Bissau"],
  [26, "Kenya"], [27, "Lesotho"], [28, "Liberia"], [29, "Libya"], [30, "Madagascar"],
  [31, "Malawi"], [32, "Mali"], [33, "Mauritania"], [34, "Mauritius"], [35, "Morocco"],
  [36, "Mozambique"], [37, "Namibia"], [38, "Niger"], [39, "Nigeria"], [40, "Rwanda"],
  [41, "São Tomé and Príncipe"], [42, "Senegal"], [43, "Seychelles"], [44, "Sierra Leone"],
  [45, "Somalia"], [46, "South Africa"], [47, "South Sudan"], [48, "Sudan"], [49, "Tanzania"],
  [50, "Togo"], [51, "Tunisia"], [52, "Uganda"], [53, "Zambia"], [54, "Zimbabwe"],
];

const LOCAL_OVERRIDES = {
  2: "/angola-falls.jpg",
  4: "/botswana-chobe-elephant.jpg",
  37: "/namibia-desert-ocean.jpg",
  46: "/table-mtn.jpg",
  53: "/vic-falls.jpg",
};

function upscaleThumbnail(url) {
  if (!url) return url;
  const wMatch = url.match(/\/(\d+)px-/);
  if (wMatch) {
    return url.replace(`/${wMatch[1]}px-`, "/1200px-");
  }
  return url;
}

async function fetchSummary(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "hotspot-app-country-images/1.0 (educational)" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

const failedFetches = [];
const COUNTRY_IMAGE_BY_ID = {};

for (const [id, title] of COUNTRIES) {
  if (LOCAL_OVERRIDES[id]) {
    COUNTRY_IMAGE_BY_ID[id] = LOCAL_OVERRIDES[id];
    continue;
  }
  try {
    const data = await fetchSummary(title);
    const source = data?.thumbnail?.source;
    if (!source) {
      throw new Error("no thumbnail.source");
    }
    COUNTRY_IMAGE_BY_ID[id] = upscaleThumbnail(source);
  } catch (err) {
    const fallback = `https://en.wikipedia.org/wiki/Special:FilePath/Flag_of_${title.replace(/ /g, "_")}.svg`;
    failedFetches.push({ id, title, error: String(err.message || err), fallback });
    COUNTRY_IMAGE_BY_ID[id] = fallback;
  }
  await new Promise((r) => setTimeout(r, 150));
}

const expected = Array.from({ length: 54 }, (_, i) => i + 1);
const missing = expected.filter((id) => !COUNTRY_IMAGE_BY_ID[id]);
const urlToIds = new Map();
for (const [idStr, url] of Object.entries(COUNTRY_IMAGE_BY_ID)) {
  const id = Number(idStr);
  if (!urlToIds.has(url)) urlToIds.set(url, []);
  urlToIds.get(url).push(id);
}
const duplicateUrls = [...urlToIds.entries()].filter(([, ids]) => ids.length > 1);

const lines = [];
lines.push("export const COUNTRY_IMAGE_BY_ID: Record<number, string> = {");
for (const id of expected) {
  const url = COUNTRY_IMAGE_BY_ID[id];
  lines.push(`  ${id}: ${JSON.stringify(url)},`);
}
lines.push("};");
lines.push("");
lines.push("export function getCountryImageUrl(countryId: number): string {");
lines.push("  return COUNTRY_IMAGE_BY_ID[countryId] ?? COUNTRY_IMAGE_BY_ID[1];");
lines.push("}");
lines.push("");

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../app/data/countryImages.ts");
fs.writeFileSync(outPath, lines.join("\n"), "utf8");

console.log("Wrote", outPath);
console.log("IDs present:", missing.length === 0 ? "all 54" : `missing: ${missing.join(",")}`);
if (duplicateUrls.length) {
  console.log("DUPLICATE URLs:");
  for (const [url, dupIds] of duplicateUrls) {
    console.log(`  ids ${dupIds.join(", ")}: ${url}`);
  }
} else {
  console.log("All URLs unique: yes");
}
if (failedFetches.length) {
  console.log("Failed fetches:");
  for (const f of failedFetches) {
    console.log(`  ${f.id} ${f.title}: ${f.error} -> ${f.fallback}`);
  }
} else {
  console.log("Failed fetches: none");
}

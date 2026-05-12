export type DeepLinkPatch = {
  regionFilter?: string;
  highlightFilter?: string;
  searchFilter?: string;
  countryId?: number;
};

/** Parse `#region-3` (1-based region index in sorted list) and optional `&country=46&highlight=…&search=…`. */
export function parseDeepLinkHash(hash: string, sortedRegions: string[]): DeepLinkPatch | null {
  if (!hash || hash === "#") return null;
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;

  const out: DeepLinkPatch = {};
  let matched = false;

  const parts = raw.split("&").map((p) => p.trim()).filter(Boolean);
  for (const part of parts) {
    const regionIdx = /^region-(\d+)$/i.exec(part);
    if (regionIdx) {
      const idx = Number(regionIdx[1]);
      if (idx >= 1 && idx <= sortedRegions.length) {
        out.regionFilter = sortedRegions[idx - 1]!;
        matched = true;
      }
      continue;
    }
    const [k, ...rest] = part.split("=");
    const v = rest.join("=");
    if (!k) continue;
    const key = k.toLowerCase();
    const val = decodeURIComponent(v.replace(/\+/g, " "));
    if (key === "country" || key === "c") {
      const id = Number(val);
      if (Number.isFinite(id)) {
        out.countryId = id;
        matched = true;
      }
    } else if (key === "region" || key === "r") {
      const asNum = Number(val);
      if (Number.isFinite(asNum) && asNum >= 1 && asNum <= sortedRegions.length) {
        out.regionFilter = sortedRegions[asNum - 1]!;
      } else if (sortedRegions.includes(val)) {
        out.regionFilter = val;
      } else {
        const found = sortedRegions.find((r) => r.toLowerCase() === val.toLowerCase());
        if (found) out.regionFilter = found;
      }
      matched = true;
    } else if (key === "highlight" || key === "h") {
      out.highlightFilter = val || "All";
      matched = true;
    } else if (key === "search" || key === "q") {
      out.searchFilter = val;
      matched = true;
    }
  }

  return matched ? out : null;
}

export function buildDeepLinkHash(
  state: {
    regionFilter: string;
    highlightFilter: string;
    searchFilter: string;
    selectedCountryId: number;
  },
  sortedRegions: string[],
  defaultCountryId: number,
  opts?: { useRegionIndex?: boolean }
): string {
  const useRegionIndex = opts?.useRegionIndex ?? true;
  const parts: string[] = [];

  if (state.regionFilter !== "All") {
    if (useRegionIndex) {
      const idx = sortedRegions.indexOf(state.regionFilter);
      if (idx !== -1) parts.push(`region-${idx + 1}`);
      else parts.push(`region=${encodeURIComponent(state.regionFilter)}`);
    } else {
      parts.push(`region=${encodeURIComponent(state.regionFilter)}`);
    }
  }
  if (state.highlightFilter !== "All") {
    parts.push(`highlight=${encodeURIComponent(state.highlightFilter)}`);
  }
  if (state.searchFilter.trim()) {
    parts.push(`search=${encodeURIComponent(state.searchFilter.trim())}`);
  }

  const anyFilter =
    state.regionFilter !== "All" ||
    state.highlightFilter !== "All" ||
    state.searchFilter.trim() !== "";
  if (anyFilter || state.selectedCountryId !== defaultCountryId) {
    parts.push(`country=${state.selectedCountryId}`);
  }

  return parts.length ? parts.join("&") : "";
}

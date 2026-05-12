"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type UIEventHandler,
} from "react";
import RegionCompare from "./components/RegionCompare";
import { countries, defaultCountryId } from "./data/countries";
import { getHighlightImageUrl } from "./data/highlightImages";
import { trackEvent } from "./lib/analytics";
import { buildDeepLinkHash, parseDeepLinkHash, type DeepLinkPatch } from "./lib/deepLink";

const AfricaMap = dynamic(() => import("./components/AfricaMap"), { ssr: false });

function HighlightIllustration({
  highlight,
  countryTitle,
}: {
  highlight: string;
  countryTitle: string;
}) {
  const src = getHighlightImageUrl(highlight);
  return (
    <figure className="space-y-2">
      <Image
        src={src}
        alt={`${highlight} — thematic photograph`}
        width={1200}
        height={800}
        className="aspect-[3/2] w-full max-w-xl rounded-md object-cover object-center mx-auto shadow-md"
        sizes="(max-width: 1024px) 100vw, 42rem"
      />
      <figcaption className="text-center text-xs text-gray-500 leading-snug px-2">
        Image for the <span className="font-medium text-gray-700">{highlight}</span> highlight,
        loaded from the web (
        <a
          href="https://unsplash.com"
          className="underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Unsplash
        </a>
        ). Stock scene, not a photo of {countryTitle} specifically.
      </figcaption>
    </figure>
  );
}

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<number>(defaultCountryId);
  const [isMobileInfoModalOpen, setIsMobileInfoModalOpen] = useState(false);
  const [isPhoneViewport, setIsPhoneViewport] = useState(false);
  const [regionFilter, setRegionFilter] = useState("All");
  const [highlightFilter, setHighlightFilter] = useState("All");
  const [searchFilter, setSearchFilter] = useState("");
  const [mapResetNonce, setMapResetNonce] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const advancedFromScrollRef = useRef<number | null>(null);
  const appliedInitialHash = useRef(false);

  const handleHotspotClick = (countryId: number) => {
    trackEvent("hotspot_click", { countryId });
    setSelectedCountry(countryId);
    if (isPhoneViewport) {
      setIsMobileInfoModalOpen(true);
    }
  };

  const applyDeepLink = useCallback((parsed: DeepLinkPatch, source: "deep_link" | "hashchange") => {
    if (parsed.regionFilter !== undefined) setRegionFilter(parsed.regionFilter);
    if (parsed.highlightFilter !== undefined) setHighlightFilter(parsed.highlightFilter);
    if (parsed.searchFilter !== undefined) setSearchFilter(parsed.searchFilter);
    if (parsed.countryId !== undefined && countries.some((c) => c.id === parsed.countryId)) {
      setSelectedCountry(parsed.countryId);
    }
    trackEvent("deep_link_applied", { source, ...parsed });
  }, []);

  const regionOptions = useMemo(
    () => Array.from(new Set(countries.map((c) => c.region))).sort(),
    []
  );
  const highlightOptions = useMemo(
    () => Array.from(new Set(countries.map((c) => c.highlight))).sort(),
    []
  );

  useLayoutEffect(() => {
    if (appliedInitialHash.current) return;
    appliedInitialHash.current = true;
    const parsed = parseDeepLinkHash(window.location.hash, regionOptions);
    if (parsed) applyDeepLink(parsed, "deep_link");
  }, [regionOptions, applyDeepLink]);

  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseDeepLinkHash(window.location.hash, regionOptions);
      if (parsed) applyDeepLink(parsed, "hashchange");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [regionOptions, applyDeepLink]);

  useEffect(() => {
    const next = buildDeepLinkHash(
      {
        regionFilter,
        highlightFilter,
        searchFilter,
        selectedCountryId: selectedCountry,
      },
      regionOptions,
      defaultCountryId
    );
    const current =
      typeof window !== "undefined" && window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : typeof window !== "undefined"
          ? window.location.hash
          : "";
    if (typeof window === "undefined" || next === current) return;
    const base = `${window.location.pathname}${window.location.search}`;
    if (next) {
      window.history.replaceState(null, "", `${base}#${next}`);
    } else {
      window.history.replaceState(null, "", base);
    }
  }, [regionFilter, highlightFilter, searchFilter, selectedCountry, regionOptions]);

  const filteredCountries = useMemo(() => {
    const normalize = (value: string) =>
      value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    const normalizedSearch = normalize(searchFilter);

    return countries.filter((country) => {
      const searchMode = normalizedSearch.length > 0;
      const regionMatch =
        searchMode || regionFilter === "All" || country.region === regionFilter;
      const highlightMatch =
        searchMode || highlightFilter === "All" || country.highlight === highlightFilter;
      const searchMatch =
        normalizedSearch === "" ||
        normalize(country.title).includes(normalizedSearch);
      return regionMatch && highlightMatch && searchMatch;
    });
  }, [regionFilter, highlightFilter, searchFilter]);

  useEffect(() => {
    if (filteredCountries.length === 0) return;
    const selectedStillVisible = filteredCountries.some(
      (country) => country.id === selectedCountry
    );
    if (!selectedStillVisible) {
      setSelectedCountry(filteredCountries[0].id);
    }
  }, [filteredCountries, selectedCountry]);

  const selectedCountryData =
    filteredCountries.find((country) => country.id === selectedCountry) ||
    filteredCountries[0] ||
    countries[0];

  useEffect(() => {
    const introEl = document.getElementById("hotspot-introduction");
    if (!introEl) return;

    introEl.scrollIntoView({ behavior: "smooth", block: "start" });

    const heading = introEl.querySelector<HTMLElement>("h1");
    heading?.focus?.();
  }, []);

  useEffect(() => {
    rightPanelRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [selectedCountry]);

  useEffect(() => {
    const phoneQuery = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => {
      setIsPhoneViewport(phoneQuery.matches);
    };
    syncViewport();
    phoneQuery.addEventListener("change", syncViewport);
    return () => {
      phoneQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  useEffect(() => {
    if (!isPhoneViewport && isMobileInfoModalOpen) {
      setIsMobileInfoModalOpen(false);
    }
  }, [isPhoneViewport, isMobileInfoModalOpen]);

  useEffect(() => {
    if (isPhoneViewport && isMobileInfoModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }

    document.body.style.overflow = "";
  }, [isMobileInfoModalOpen, isPhoneViewport]);

  const selectedIndex = filteredCountries.findIndex((c) => c.id === selectedCountry);

  const goToIndex = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= filteredCountries.length) return;
    const nextId = filteredCountries[nextIndex]?.id;
    if (!nextId) return;
    if (nextId === selectedCountry) return;
    advancedFromScrollRef.current = nextId;
    trackEvent("panel_scroll_select", { countryId: nextId });
    setSelectedCountry(nextId);
  };

  const handleResetView = () => {
    trackEvent("reset_view", { source: "reset" });
    setRegionFilter("All");
    setHighlightFilter("All");
    setSearchFilter("");
    setSelectedCountry(defaultCountryId);
    setMapResetNonce((n) => n + 1);
    setIsMobileInfoModalOpen(false);
    const base = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(null, "", base);
  };

  const handleShareDeepLink = async () => {
    const hash = buildDeepLinkHash(
      {
        regionFilter,
        highlightFilter,
        searchFilter,
        selectedCountryId: selectedCountry,
      },
      regionOptions,
      defaultCountryId
    );
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}${hash ? `#${hash}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      trackEvent("share_link_copy", { hasHash: Boolean(hash) });
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      trackEvent("share_link_copy_failed", {});
    }
  };

  const handleRightPanelScroll: UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    const scrollTop = el.scrollTop;
    const clientHeight = el.clientHeight;
    const scrollHeight = el.scrollHeight;

    const thresholdPx = 24;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - thresholdPx;
    const nearTop = scrollTop <= thresholdPx;

    if (nearBottom && selectedIndex !== -1) {
      const nextId = filteredCountries[selectedIndex + 1]?.id;
      if (nextId && advancedFromScrollRef.current !== nextId) {
        goToIndex(selectedIndex + 1);
      }
    } else if (nearTop && selectedIndex !== -1) {
      const prevId = filteredCountries[selectedIndex - 1]?.id;
      if (prevId && advancedFromScrollRef.current !== prevId) {
        goToIndex(selectedIndex - 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <section
          id="hotspot-introduction"
          aria-label="How to interact"
          className="mb-8 rounded-lg bg-white p-6 shadow-sm border border-gray-200"
        >
          <h1 tabIndex={-1} className="text-xl text-center font-bold text-gray-900 mb-2">
            Interactive page to explore some of Africa&apos;s countries
          </h1>
          <p className="text-gray-700 text-center leading-relaxed">
            Click a marker on the map to select a country (all 54 African UN member states). Country
            details appear on the right (or in a panel on small screens). Filter by region or
            highlight, or search by name. The map uses OpenStreetMap tiles with Leaflet; blue
            circles mark each hotspot. The large photo matches the country&apos;s highlight theme
            and is fetched from Unsplash. Use <strong>Compare regions</strong> for a side-by-side
            table, <strong>Reset view</strong> to clear filters and refit the map, and{" "}
            <strong>Copy share link</strong> for URLs like <code className="text-sm">#region-3</code>{" "}
            (region index in the sorted list) plus optional filters.
          </p>
        </section>

        <section className="mb-8 rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold text-gray-900">Data panel updates</h2>
            <div className="text-sm text-gray-600">
              Showing {filteredCountries.length} of {countries.length} countries
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Search</span>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => {
                  const v = e.target.value;
                  trackEvent("filter_menu", { field: "search", value: v });
                  setSearchFilter(v);
                }}
                placeholder="Search country..."
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Region</span>
              <select
                value={regionFilter}
                onChange={(e) => {
                  const v = e.target.value;
                  trackEvent("filter_menu", { field: "region", value: v });
                  setRegionFilter(v);
                }}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="All">All regions</option>
                {regionOptions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Highlight</span>
              <select
                value={highlightFilter}
                onChange={(e) => {
                  const v = e.target.value;
                  trackEvent("filter_menu", { field: "highlight", value: v });
                  setHighlightFilter(v);
                }}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="All">All highlights</option>
                {highlightOptions.map((highlight) => (
                  <option key={highlight} value={highlight}>
                    {highlight}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleResetView}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Reset view
            </button>
            <button
              type="button"
              onClick={() => void handleShareDeepLink()}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              {shareCopied ? "Link copied" : "Copy share link"}
            </button>
            <span className="text-xs text-gray-500">
              Deep link uses sorted region index, e.g.{" "}
              <code className="rounded bg-gray-100 px-1">#region-3</code>
            </span>
          </div>
        </section>

        <RegionCompare
          countries={countries}
          regionOptions={regionOptions}
          onPairChange={(a, b) => trackEvent("compare_regions", { regionA: a, regionB: b })}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch lg:min-h-0">
          <div
            className={[
              "relative z-0 min-w-0 bg-white rounded-lg shadow-lg overflow-hidden lg:h-[80vh]",
              isPhoneViewport && isMobileInfoModalOpen ? "max-lg:hidden" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="relative isolate z-0 h-[55vh] min-h-[320px] max-h-[700px] w-full min-w-0 overflow-hidden lg:h-full lg:max-h-none">
              <AfricaMap
                countries={filteredCountries}
                selectedCountryId={selectedCountry}
                onSelectCountry={handleHotspotClick}
                mapResetNonce={mapResetNonce}
              />
            </div>
          </div>

          <div
            ref={rightPanelRef}
            onScroll={handleRightPanelScroll}
            className="relative z-10 hidden min-w-0 bg-white rounded-lg shadow-lg p-8 overflow-y-auto overflow-x-hidden lg:block lg:h-[80vh]"
          >
            {filteredCountries.length > 0 ? (
              <div className="space-y-6">
                <div className="pb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCountryData.title}
                  </h2>
                  <div className="mb-3 text-sm text-gray-500">
                    {selectedCountryData.region} • {selectedCountryData.highlight}
                  </div>
                  <div className="text-gray-600 leading-relaxed space-y-4">
                    <p>{selectedCountryData.description}</p>
                    <HighlightIllustration
                      highlight={selectedCountryData.highlight}
                      countryTitle={selectedCountryData.title}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No countries match the selected filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {isPhoneViewport && isMobileInfoModalOpen && (
        <div
          className="fixed inset-0 z-[10000] flex flex-col justify-end"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 z-0 bg-black/50"
            aria-label="Close country information"
            onClick={() => setIsMobileInfoModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedCountryData.title} information`}
            className="relative z-10 max-h-[80vh] overflow-y-auto overflow-x-hidden rounded-t-2xl bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl"
          >
            {filteredCountries.length > 0 ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCountryData.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsMobileInfoModalOpen(false)}
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700"
                  >
                    Close
                  </button>
                </div>
                <div className="mb-3 text-sm text-gray-500">
                  {selectedCountryData.region} • {selectedCountryData.highlight}
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>{selectedCountryData.description}</p>
                  <HighlightIllustration
                    highlight={selectedCountryData.highlight}
                    countryTitle={selectedCountryData.title}
                  />
                </div>
              </>
            ) : (
              <div className="text-gray-500">
                No countries match the selected filters.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

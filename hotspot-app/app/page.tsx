"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type UIEventHandler } from "react";
import { countries, defaultCountryId } from "./data/countries";
import { getHighlightImageUrl } from "./data/highlightImages";

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
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const advancedFromScrollRef = useRef<number | null>(null);

  const handleHotspotClick = (countryId: number) => {
    setSelectedCountry(countryId);
    if (isPhoneViewport) {
      setIsMobileInfoModalOpen(true);
    }
  };

  const regionOptions = useMemo(
    () => Array.from(new Set(countries.map((c) => c.region))).sort(),
    []
  );
  const highlightOptions = useMemo(
    () => Array.from(new Set(countries.map((c) => c.highlight))).sort(),
    []
  );

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

    const heading = introEl.querySelector<HTMLElement>("h2");
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
    setSelectedCountry(nextId);
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
          <h2 tabIndex={-1} className="text-xl text-center font-bold text-gray-900 mb-2">
            Interactive page to explore some of Africa&apos;s countries
          </h2>
          <p className="text-gray-700 text-center leading-relaxed">
            Click a marker on the map to select a country (all 54 African UN member states). Country
            details appear on the right (or in a panel on small screens). Filter by region or
            highlight, or search by name. The map uses OpenStreetMap tiles with Leaflet; blue
            circles mark each hotspot. The large photo matches the country&apos;s highlight theme
            and is fetched from Unsplash.
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
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search country..."
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Region</span>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
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
                onChange={(e) => setHighlightFilter(e.target.value)}
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
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="relative bg-white rounded-lg shadow-lg overflow-hidden lg:h-[80vh]">
            <div className="relative w-full h-[55vh] min-h-[320px] max-h-[700px] lg:h-full">
              <AfricaMap
                countries={filteredCountries}
                selectedCountryId={selectedCountry}
                onSelectCountry={handleHotspotClick}
              />
            </div>
          </div>

          <div
            ref={rightPanelRef}
            onScroll={handleRightPanelScroll}
            className="hidden lg:block bg-white rounded-lg shadow-lg p-8 overflow-y-auto lg:h-[80vh]"
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
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close country information"
            onClick={() => setIsMobileInfoModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedCountryData.title} information`}
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl"
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

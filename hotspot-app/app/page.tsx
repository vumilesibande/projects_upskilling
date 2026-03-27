"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import "./globals.css";

interface Country {
  id: number;
  title: string;
  copy: ReactNode;
  position: { top: string; left: string };
  mobilePosition?: { top: string; left: string };
  flag: string;
  region: string;
  highlight: string;
}

const countries: Country[] = [
  {
    id: 1,
    title: "South Africa",
    copy: (
      <div className="space-y-4">
        <p>
          <span className="italic">South Africa</span> is a country located at
          the southern tip of the African continent. It is situated entirely
          within the Southern Hemisphere and is bordered to the north by{" "}
          <span className="italic">Namibia</span>,{" "}
          <span className="italic">Botswana</span>, and{" "}
          <span className="italic">Zimbabwe</span>, to the northeast by{" "}
          <span className="italic">Mozambique</span> and{" "}
          <span className="italic">Eswatini</span>, and it surrounds the kingdom
          of <span className="italic">Lesotho</span>. It is flanked by the
          Atlantic Ocean to the southwest and the Indian Ocean to the southeast.
        </p>
        <p>The tourist attraction is Table Mountain.</p>
        <Image
          src="/table-mtn.jpg"
          alt="table-mtn"
          className="object-contain object-center mx-auto"
          width={300}
          height={300}
        />
      </div>
    ),
    position: { top: "89%", left: "64%" },
    mobilePosition: { top: "68%", left: "67%" },
    flag: "/flags/ZA.png",
    region: "Southern Africa",
    highlight: "Mountain",
  },
  {
    id: 2,
    title: "Angola",
    copy: (
      <div className="space-y-4">
        <p>
          Angola is a country located in the southwestern corner of Africa. Known
          for its diverse landscapes - from the Namib Desert's otherworldly dunes
          to the savannahs and the towering peaks of the Brandberg Mountains -
          Angola is a destination that captivates the senses. Its vast, open
          spaces, rich cultural heritage, and vibrant wildlife make it a truly
          unforgettable experience.
        </p>
        <Image
        src="/angola-falls.jpg"
        alt="falls"
        className="object-contain object-center mx-auto"
        width={300}
        height={300}
        />
      </div>
  ),
    position: { top: "67%", left: "57%" },
    mobilePosition: { top: "62%", left: "58%" },
    flag: "/flags/AO.png",
    region: "Central Africa",
    highlight: "Waterfall",
  },
  {
    id: 3,
    title: "Namibia",
    copy: (
      <div className="space-y-4">
        <p>
          Namibia, a land of stark beauty and untamed wilderness, is a country
          located in the southwestern corner of Africa. Known for its diverse
          landscapes - from the Namib Desert's otherworldly dunes to the savannahs
          and the towering peaks of the Brandberg Mountains - Namibia is a
          destination that captivates the senses. Its vast, open spaces, rich
          cultural heritage, and vibrant wildlife make it a truly unforgettable
          experience.
        </p>
        <Image
          src="/namibia-desert-ocean.jpg"
          alt="desert"
          className="object-contain object-center mx-auto"
          width={300}
          height={300}
        />
      </div>
        
    ),
    position: { top: "80%", left: "56%" },
    mobilePosition: { top: "70%", left: "58%" },
    flag: "/flags/NA.png",
    region: "Southern Africa",
    highlight: "Desert",
  },
  {
    id: 4,
    title: "Zimbabwe",
    copy: (
      <div className="space-y-4">
        <p>
        Zimbabwe, a land of breathtaking beauty and untamed wilderness, is a
        country located in the southeastern corner of Africa. Known for its
        diverse landscapes - from the majestic Victoria Falls to the rolling
        hills of the Matobo National Park - Zimbabwe is a destination that
        captivates the senses. Its rich cultural heritage, vibrant wildlife, and
        unique wildlife make it a truly unforgettable experience.
      </p>
      <Image
        src="/vic-falls.jpg"
        alt="victoria-falls"
        className="object-contain object-center mx-auto"
        width={300}
        height={300}
      />
      </div>
    
    ),
    position: { top: "75%", left: "71%" },
    mobilePosition: { top: "73%", left: "72%" },
    flag: "/flags/ZW.png",
    region: "Southern Africa",
    highlight: "Waterfall",
  },
  {
    id: 5,
    title: "Botswana",
    copy: (
      <div className="space-y-4">
        <p>
        Botswana, a land of breathtaking beauty and untamed wilderness, is a
        country located in the southeastern corner of Africa. Known for its
        diverse landscapes - from the majestic Victoria Falls to the rolling
        hills of the Matobo National Park - Botswana is a destination that
        captivates the senses. Its rich cultural heritage, vibrant wildlife, and
        unique wildlife make it a truly unforgettable experience.
      </p>
      <Image
        src="/botswana-chobe-elephant.jpg"
        alt="elephant"
        className="object-contain object-center mx-auto"
        width={300}
        height={300}
      />
      </div>
      
    ),
    position: { top: "78%", left: "64%" },
    mobilePosition: { top: "70%", left: "66%" },
    flag: "/flags/BW.png",
    region: "Southern Africa",
    highlight: "Wildlife",
  },
];

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<number>(1);
  const [isMobileInfoModalOpen, setIsMobileInfoModalOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [regionFilter, setRegionFilter] = useState("All");
  const [highlightFilter, setHighlightFilter] = useState("All");
  const [searchFilter, setSearchFilter] = useState("");
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const advancedFromScrollRef = useRef<number | null>(null);

  const handleHotspotClick = (countryId: number) => {
    setSelectedCountry(countryId);
    if (isMobileViewport) {
      setIsMobileInfoModalOpen(true);
    }
  };

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
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const syncViewport = () => setIsMobileViewport(mediaQuery.matches);
    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    if (!isMobileViewport && isMobileInfoModalOpen) {
      setIsMobileInfoModalOpen(false);
    }
  }, [isMobileViewport, isMobileInfoModalOpen]);

 
  useEffect(() => {
    if (!isMobileViewport || !isMobileInfoModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileInfoModalOpen, isMobileViewport]);

  const selectedIndex = filteredCountries.findIndex((c) => c.id === selectedCountry);

  const goToIndex = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= filteredCountries.length) return;
    const nextId = filteredCountries[nextIndex]?.id;
    if (!nextId) return;
    if (nextId === selectedCountry) return;
    advancedFromScrollRef.current = nextId;
    setSelectedCountry(nextId);
  };

  const handleRightPanelScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    const scrollTop = el.scrollTop;
    const clientHeight = el.clientHeight;
    const scrollHeight = el.scrollHeight;

    // Use a small threshold so mobile browsers don't miss the "near edge" state.
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
            Interactive page to explore some of Africa's countries
          </h2>
          <p className="text-gray-700 text-center leading-relaxed">
            Click on the flag hotspots on the map to select a country. The country
            name and information will appear on the right. The map is a static image and the flags are interactive. You can also filter the countries by region and highlight. When filter by region or highlight, the countries will be filtered accordingly. When it shows more than one country flag on the map, you can click on the flag to select a country.
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
                <option value="Southern Africa">Southern Africa</option>
                <option value="Central Africa">Central Africa</option>
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
                <option value="Mountain">Mountain</option>
                <option value="Desert">Desert</option>
                <option value="Waterfall">Waterfall</option>
                <option value="Wildlife">Wildlife</option>
              </select>
            </label>
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* first column: Map with Hotspots using country flags */}
          <div className="relative bg-white rounded-lg shadow-lg overflow-hidden lg:h-[80vh]">
            <div className="relative w-full h-[55vh] min-h-[320px] max-h-[700px] lg:h-full">
              {/* image of map */}
              <Image
                src="/map.jpg"
                alt="Map"
                fill
                className="map-image object-center"
                priority
              />

              {/* Flag Icons */}
              {filteredCountries.map((country) => (
                (() => {
                  const activePosition =
                    isMobileViewport && country.mobilePosition
                      ? country.mobilePosition
                      : country.position;

                  return (
                <button
                  key={country.id}
                  onClick={() => handleHotspotClick(country.id)}
                  className="flag-icon"
                  style={{
                    top: activePosition.top,
                    left: activePosition.left,
                  }}
                  aria-label={`Select ${country.title}`}
                >
                  <div
                    className={`relative w-12 h-8 rounded transition-all duration-300 ${
                      selectedCountry === country.id ? "scale-125" : ""
                    }`}
                  >
                    <Image
                      src={country.flag}
                      alt={`${country.title} flag`}
                      fill
                      className="flag-icon-item"
                    />
                  </div>
                </button>
                  );
                })()
              ))}
            </div>
          </div>

          {/* Column 2: Country Information (desktop only) */}
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
                  <div className="text-gray-600 leading-relaxed">
                    {selectedCountryData.copy}
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

      {/* Mobile country info modal */}
      {isMobileInfoModalOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
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
                <div className="text-gray-600 leading-relaxed">
                  {selectedCountryData.copy}
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

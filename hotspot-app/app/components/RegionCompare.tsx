"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Country } from "../data/countries";

type Props = {
  countries: Country[];
  regionOptions: string[];
  onPairChange?: (regionA: string, regionB: string) => void;
};

type RegionStats = {
  count: number;
  highlightsSorted: [string, number][];
  names: string[];
};

function regionStats(countries: Country[], region: string): RegionStats {
  const list = countries.filter((c) => c.region === region);
  const byHighlight: Record<string, number> = {};
  for (const c of list) {
    byHighlight[c.highlight] = (byHighlight[c.highlight] ?? 0) + 1;
  }
  const highlightsSorted = Object.entries(byHighlight).sort((x, y) => y[1] - x[1]);
  return { count: list.length, highlightsSorted, names: list.map((c) => c.title).sort() };
}

function RegionCompareCard({
  region,
  stats,
  tone,
}: {
  region: string;
  stats: RegionStats;
  tone: "a" | "b";
}) {
  const headerTone =
    tone === "a"
      ? "bg-emerald-100 text-emerald-950"
      : "bg-amber-100 text-amber-950";
  const countTone = tone === "a" ? "text-emerald-900" : "text-amber-900";

  return (
    <article className="overflow-hidden rounded-lg border border-orange-200 bg-white/90">
      <h3 className={`px-4 py-3 text-base font-semibold leading-snug ${headerTone}`}>
        {region}
      </h3>
      <dl className="divide-y divide-orange-100 px-4 text-sm">
        <div className="py-3">
          <dt className="mb-1 text-stone-600">Countries</dt>
          <dd className={`text-2xl font-bold ${countTone}`}>{stats.count}</dd>
        </div>
        <div className="py-3">
          <dt className="mb-2 text-stone-600">By highlight</dt>
          <dd>
            <ul className="space-y-1.5">
              {stats.highlightsSorted.map(([highlight, count]) => (
                <li
                  key={highlight}
                  className="flex items-center justify-between gap-3 rounded-md bg-stone-50 px-2.5 py-1.5"
                >
                  <span className="text-stone-800">{highlight}</span>
                  <span className={`font-semibold tabular-nums ${countTone}`}>{count}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="py-3">
          <dt className="mb-2 text-stone-600">Countries (A–Z)</dt>
          <dd>
            <ul className="max-h-48 space-y-1 overflow-y-auto text-xs leading-relaxed text-stone-700">
              {stats.names.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </article>
  );
}

function RegionCompareTable({
  regionA,
  regionB,
  statsA,
  statsB,
}: {
  regionA: string;
  regionB: string;
  statsA: RegionStats;
  statsB: RegionStats;
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-orange-200">
      <table className="w-full min-w-[640px] text-sm text-left">
        <thead className="bg-gradient-to-r from-emerald-100 to-amber-100 text-emerald-950">
          <tr>
            <th className="w-1/4 px-4 py-2.5 font-semibold">Metric</th>
            <th className="px-4 py-2.5 font-semibold">{regionA}</th>
            <th className="px-4 py-2.5 font-semibold">{regionB}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-100 bg-white/80">
          <tr>
            <td className="px-4 py-2.5 text-stone-600">Countries</td>
            <td className="px-4 py-2.5 font-semibold text-emerald-900">{statsA.count}</td>
            <td className="px-4 py-2.5 font-semibold text-amber-900">{statsB.count}</td>
          </tr>
          <tr>
            <td className="px-4 py-2.5 align-top text-stone-600">By highlight</td>
            <td className="px-4 py-2.5 align-top text-stone-800">
              <ul className="list-disc space-y-1 pl-4">
                {statsA.highlightsSorted.map(([h, n]) => (
                  <li key={h}>
                    {h}: {n}
                  </li>
                ))}
              </ul>
            </td>
            <td className="px-4 py-2.5 align-top text-stone-800">
              <ul className="list-disc space-y-1 pl-4">
                {statsB.highlightsSorted.map(([h, n]) => (
                  <li key={h}>
                    {h}: {n}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2.5 align-top text-stone-600">Countries (A–Z)</td>
            <td className="max-h-40 overflow-y-auto px-4 py-2.5 align-top text-xs leading-relaxed text-stone-700">
              {statsA.names.join(", ")}
            </td>
            <td className="max-h-40 overflow-y-auto px-4 py-2.5 align-top text-xs leading-relaxed text-stone-700">
              {statsB.names.join(", ")}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function RegionCompare({ countries, regionOptions, onPairChange }: Props) {
  const [a, setA] = useState(() => regionOptions[0] ?? "");
  const [b, setB] = useState(() => regionOptions[1] ?? regionOptions[0] ?? "");

  const onPairChangeRef = useRef(onPairChange);
  onPairChangeRef.current = onPairChange;

  useEffect(() => {
    if (regionOptions.length === 0) return;
    setA((prev) => (regionOptions.includes(prev) ? prev : regionOptions[0]!));
    setB((prev) => (regionOptions.includes(prev) ? prev : regionOptions[1] ?? regionOptions[0]!));
  }, [regionOptions]);

  useEffect(() => {
    onPairChangeRef.current?.(a, b);
  }, [a, b]);

  const statsA = useMemo(() => regionStats(countries, a), [countries, a]);
  const statsB = useMemo(() => regionStats(countries, b), [countries, b]);

  if (regionOptions.length < 2) {
    return null;
  }

  return (
    <section
      id="region-compare"
      aria-labelledby="region-compare-heading"
      className="hotspot-card mb-8"
    >
      <h2 id="region-compare-heading" className="hotspot-section-title mb-2">
        Compare regions
      </h2>
      <p className="mb-4 text-sm text-stone-600">
        Side-by-side snapshot of two UN-style subregions (country counts and highlight mix).
      </p>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-emerald-900">Region A</span>
          <select value={a} onChange={(e) => setA(e.target.value)} className="hotspot-field">
            {regionOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-amber-900">Region B</span>
          <select value={b} onChange={(e) => setB(e.target.value)} className="hotspot-field">
            {regionOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:hidden">
        <RegionCompareCard region={a} stats={statsA} tone="a" />
        <RegionCompareCard region={b} stats={statsB} tone="b" />
      </div>

      <div className="hidden md:block">
        <RegionCompareTable regionA={a} regionB={b} statsA={statsA} statsB={statsB} />
      </div>
    </section>
  );
}

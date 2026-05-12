"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Country } from "../data/countries";

type Props = {
  countries: Country[];
  regionOptions: string[];
  onPairChange?: (regionA: string, regionB: string) => void;
};

function regionStats(countries: Country[], region: string) {
  const list = countries.filter((c) => c.region === region);
  const byHighlight: Record<string, number> = {};
  for (const c of list) {
    byHighlight[c.highlight] = (byHighlight[c.highlight] ?? 0) + 1;
  }
  const highlightsSorted = Object.entries(byHighlight).sort((x, y) => y[1] - x[1]);
  return { count: list.length, highlightsSorted, names: list.map((c) => c.title).sort() };
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
      className="mb-8 rounded-lg bg-white p-6 shadow-sm border border-gray-200"
    >
      <h2 id="region-compare-heading" className="text-xl font-bold text-gray-900 mb-2">
        Compare regions
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Side-by-side snapshot of two UN-style subregions (country counts and highlight mix).
      </p>
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Region A</span>
          <select
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {regionOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Region B</span>
          <select
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {regionOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="w-full min-w-[320px] text-sm text-left">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="px-3 py-2 font-semibold w-1/3">Metric</th>
              <th className="px-3 py-2 font-semibold">{a}</th>
              <th className="px-3 py-2 font-semibold">{b}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-3 py-2 text-gray-600">Countries</td>
              <td className="px-3 py-2 font-medium text-gray-900">{statsA.count}</td>
              <td className="px-3 py-2 font-medium text-gray-900">{statsB.count}</td>
            </tr>
            <tr>
              <td className="px-3 py-2 align-top text-gray-600">By highlight</td>
              <td className="px-3 py-2 align-top text-gray-800">
                <ul className="list-disc list-inside space-y-0.5">
                  {statsA.highlightsSorted.map(([h, n]) => (
                    <li key={h}>
                      {h}: {n}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-3 py-2 align-top text-gray-800">
                <ul className="list-disc list-inside space-y-0.5">
                  {statsB.highlightsSorted.map(([h, n]) => (
                    <li key={h}>
                      {h}: {n}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 align-top text-gray-600">Countries (A–Z)</td>
              <td className="px-3 py-2 align-top text-xs text-gray-700 max-h-40 overflow-y-auto">
                {statsA.names.join(", ")}
              </td>
              <td className="px-3 py-2 align-top text-xs text-gray-700 max-h-40 overflow-y-auto">
                {statsB.names.join(", ")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

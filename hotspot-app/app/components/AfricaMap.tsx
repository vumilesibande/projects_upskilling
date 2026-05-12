"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import { Country } from "../data/countries";
import { useEffect } from "react";

/** Rough bounds covering Africa + Madagascar + Atlantic/Cape Verde and Indian Ocean islands (e.g. Mauritius). */
const AFRICA_BOUNDS: LatLngBoundsExpression = [
  [-38, -26],
  [39, 60],
];

type Props = {
  countries: Country[];
  selectedCountryId: number;
  onSelectCountry: (id: number) => void;
};

function RecenterOnSelected({ countries, selectedCountryId }: { countries: Country[]; selectedCountryId: number }) {
  const map = useMap();

  useEffect(() => {
    const selected = countries.find((c) => c.id === selectedCountryId);
    if (!selected) return;
    map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 4), { duration: 0.8 });
  }, [countries, selectedCountryId, map]);

  return null;
}

export default function AfricaMap({ countries, selectedCountryId, onSelectCountry }: Props) {
  return (
    <MapContainer
      center={[-2, 20]}
      zoom={3}
      minZoom={3}
      maxZoom={8}
      maxBounds={AFRICA_BOUNDS}
      maxBoundsViscosity={1}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {countries.map((country) => {
        const selected = country.id === selectedCountryId;
        return (
          <CircleMarker
            key={country.id}
            center={[country.lat, country.lng]}
            radius={selected ? 11 : 8}
            pathOptions={{
              color: selected ? "#1d4ed8" : "#ffffff",
              weight: selected ? 3 : 2,
              fillColor: selected ? "#3b82f6" : "#60a5fa",
              fillOpacity: selected ? 0.95 : 0.75,
            }}
            eventHandlers={{ click: () => onSelectCountry(country.id) }}
          >
            <Tooltip direction="top" offset={[0, -12]}>
              {country.title}
            </Tooltip>
          </CircleMarker>
        );
      })}

      <RecenterOnSelected countries={countries} selectedCountryId={selectedCountryId} />
    </MapContainer>
  );
}

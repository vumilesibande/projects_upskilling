"use client";

import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Marker, Tooltip, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import { Country } from "../data/countries";
import { getCountryFlagUrl } from "../data/countryFlags";
import { useEffect, useMemo } from "react";

const AFRICA_BOUNDS: LatLngBoundsExpression = [
  [-38, -26],
  [39, 60],
];

const FLAG_WIDTH_SELECTED = 40;

function createSelectedFlagIcon(country: Country): L.Icon {
  const width = FLAG_WIDTH_SELECTED;
  const height = Math.round(width * 0.67);

  return L.icon({
    iconUrl: getCountryFlagUrl(country.id, width),
    iconSize: [width, height],
    iconAnchor: [width / 2, height / 2],
    tooltipAnchor: [0, -Math.ceil(height / 2) - 4],
    className: "country-flag-leaflet-icon country-flag-leaflet-icon--selected",
  });
}

type Props = {
  countries: Country[];
  selectedCountryId: number;
  onSelectCountry: (id: number) => void;
  mapResetNonce?: number;
};

function FitAfricaOnReset({ mapResetNonce = 0 }: { mapResetNonce?: number }) {
  const map = useMap();

  useEffect(() => {
    if (mapResetNonce === 0) return;
    map.fitBounds(AFRICA_BOUNDS, { padding: [28, 28], maxZoom: 5, animate: true, duration: 0.55 });
  }, [mapResetNonce, map]);

  return null;
}

function RecenterOnSelected({ countries, selectedCountryId }: { countries: Country[]; selectedCountryId: number }) {
  const map = useMap();

  useEffect(() => {
    const selected = countries.find((c) => c.id === selectedCountryId);
    if (!selected) return;
    map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 4), { duration: 0.8 });
  }, [countries, selectedCountryId, map]);

  return null;
}

export default function AfricaMap({
  countries,
  selectedCountryId,
  onSelectCountry,
  mapResetNonce = 0,
}: Props) {
  const selectedFlagIcons = useMemo(() => {
    const icons = new Map<number, L.Icon>();
    for (const country of countries) {
      if (country.id === selectedCountryId) {
        icons.set(country.id, createSelectedFlagIcon(country));
      }
    }
    return icons;
  }, [countries, selectedCountryId]);

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
        const position: [number, number] = [country.lat, country.lng];

        if (selected) {
          const icon = selectedFlagIcons.get(country.id)!;
          return (
            <Marker
              key={country.id}
              position={position}
              icon={icon}
              zIndexOffset={1000}
              eventHandlers={{ click: () => onSelectCountry(country.id) }}
            >
              <Tooltip direction="top" offset={[0, -18]}>
                {country.title}
              </Tooltip>
            </Marker>
          );
        }

        return (
          <CircleMarker
            key={country.id}
            center={position}
            radius={8}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: "#60a5fa",
              fillOpacity: 0.85,
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
      <FitAfricaOnReset mapResetNonce={mapResetNonce} />
    </MapContainer>
  );
}

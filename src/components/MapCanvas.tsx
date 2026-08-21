import L from "leaflet";
import { useEffect } from "react";
import { GeoJSON, MapContainer, Marker, ZoomControl, useMap } from "react-leaflet";
import type { Feature, GeoJsonObject } from "geojson";
import { activeState, regionColorVar, type RegionKey } from "@/data/state-config";
import type { Site } from "@/data/sites";

const categoryGlyph: Record<string, string> = {
  fort: "M2 20h20V10l-3 2V8l-3 2V6l-4-3-4 3v4L5 8v4l-3-2z",
  temple: "M12 2l5 5H7l5-5zM6 9h12l2 4H4l2-4zm-2 6h16v6H4z",
  cave: "M4 21V12a8 8 0 1116 0v9h-5v-6a3 3 0 10-6 0v6H4z",
  museum: "M3 10L12 4l9 6H3zm2 2h2v7H5zm4 0h2v7H9zm4 0h2v7h-2zm4 0h2v7h-2zM3 21h18v-2H3z",
  festival: "M12 2l2.5 6H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z",
  craft: "M4 20h16v2H4zm2-4h12l-1-8H7zM9 4h6v3H9z",
  nature: "M12 2l6 9h-4l4 7H6l4-7H6z",
};

function pinIcon(site: Site, active: boolean) {
  const path = categoryGlyph[site.category] ?? categoryGlyph["fort"]!;
  return L.divIcon({
    className: "",
    iconSize: [34, 42],
    iconAnchor: [17, 40],
    html: `
      <div style="position:relative;width:34px;height:42px;transform:translateY(${active ? "-4px" : "0"});transition:transform .2s">
        <svg viewBox="0 0 34 42" width="34" height="42" style="filter:drop-shadow(0 6px 8px rgba(60,20,10,.45))">
          <path d="M17 41C17 41 32 25.5 32 15.5C32 7.5 25.3 1 17 1C8.7 1 2 7.5 2 15.5C2 25.5 17 41 17 41Z"
            fill="var(--secondary)" stroke="var(--accent)" stroke-width="${active ? 3 : 2}"/>
          <circle cx="17" cy="15.5" r="10.5" fill="var(--accent)"/>
          <g transform="translate(6.2,4.7) scale(0.9)">
            <path d="${path}" fill="var(--secondary)"/>
          </g>
        </svg>
      </div>`,
  });
}

function FlyTo({ site }: { site: Site | null }) {
  const map = useMap();
  useEffect(() => {
    if (site) map.flyTo([site.lat, site.lng], 9, { duration: 1.1 });
  }, [site, map]);
  return null;
}

export default function MapCanvas({
  visibleSites,
  focused,
  onSelect,
}: {
  visibleSites: Site[];
  focused: Site | null;
  onSelect: (site: Site) => void;
}) {
  const regionOf = (name: string): RegionKey =>
    activeState.districtRegions[name] ?? "marathwada";

  return (
    <MapContainer
      bounds={activeState.bounds}
      center={activeState.center}
      zoom={activeState.defaultZoom}
      minZoom={6}
      maxZoom={12}
      scrollWheelZoom
      zoomControl={false}
      attributionControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <ZoomControl position="bottomleft" />
      <FlyTo site={focused} />

      <GeoJSON
        data={activeState.geoJson as GeoJsonObject}
        style={(feature) => {
          const name = String(
            (feature as Feature)?.properties?.[activeState.districtPropertyKey] ?? "",
          );
          return {
            fillColor: `var(${regionColorVar[regionOf(name)]})`,
            fillOpacity: 0.92,
            color: "var(--map-stroke)",
            weight: 1.1,
          };
        }}
        onEachFeature={(feature, layer) => {
          const name = String(feature.properties?.[activeState.districtPropertyKey] ?? "");
          layer.bindTooltip(name, {
            className: "district-tip",
            direction: "center",
            sticky: true,
          });
          layer.on({
            mouseover: (e) => (e.target as L.Path).setStyle({ fillOpacity: 1, weight: 2.2 }),
            mouseout: (e) => (e.target as L.Path).setStyle({ fillOpacity: 0.92, weight: 1.1 }),
          });
        }}
      />
      {visibleSites.map((site) => (
        <Marker
          key={site.id}
          position={[site.lat, site.lng]}
          icon={pinIcon(site, focused?.id === site.id)}
          eventHandlers={{ click: () => onSelect(site) }}
        />
      ))}
    </MapContainer>
  );
}

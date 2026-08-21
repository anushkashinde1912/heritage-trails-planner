/**
 * State configuration layer.
 *
 * Everything state-specific lives here (or in ./sites.ts + the districts
 * GeoJSON). Core app code only talks to `activeState`, so pointing the app at
 * another Indian state means adding a new config + GeoJSON + site seed file.
 */
import districtsGeoJson from "./maharashtra-districts.json";

export type RegionKey =
  | "konkan"
  | "nashik"
  | "pune"
  | "marathwada"
  | "amravati"
  | "nagpur";

export type StateConfig = {
  code: string;
  name: string;
  nameTranslations: Record<string, string>;
  center: [number, number];
  defaultZoom: number;
  bounds: [[number, number], [number, number]];
  districtPropertyKey: string;
  districtRegions: Record<string, RegionKey>;
  regionLabels: Record<RegionKey, string>;
  geoJson: unknown;
};

const districtRegions: Record<string, RegionKey> = {
  Palghar: "konkan",
  Raigarh: "konkan",
  Ratnagiri: "konkan",
  Sindhudurg: "konkan",
  Thane: "nashik",
  Nandurbar: "nashik",
  Dhule: "nashik",
  Jalgaon: "nashik",
  Nashik: "nashik",
  Ahmadnagar: "nashik",
  Mumbai: "pune",
  "Mumbai Suburban": "pune",
  Pune: "pune",
  Satara: "pune",
  Sangli: "pune",
  Solapur: "pune",
  Kolhapur: "pune",
  Aurangabad: "marathwada",
  Jalna: "marathwada",
  Parbhani: "marathwada",
  Hingoli: "marathwada",
  Nanded: "marathwada",
  Bid: "marathwada",
  Latur: "marathwada",
  Osmanabad: "marathwada",
  Buldana: "amravati",
  Akola: "amravati",
  Washim: "amravati",
  Amravati: "amravati",
  Yavatmal: "amravati",
  Nagpur: "nagpur",
  Wardha: "nagpur",
  Bhandara: "nagpur",
  Gondiya: "nagpur",
  Chandrapur: "nagpur",
  Gadchiroli: "nagpur",
};

export const regionColorVar: Record<RegionKey, string> = {
  konkan: "--region-konkan",
  nashik: "--region-nashik",
  pune: "--region-pune",
  marathwada: "--region-marathwada",
  amravati: "--region-amravati",
  nagpur: "--region-nagpur",
};

export const activeState: StateConfig = {
  code: "MH",
  name: "Maharashtra",
  nameTranslations: { en: "Maharashtra", mr: "महाराष्ट्र", hi: "महाराष्ट्र" },
  center: [19.0, 76.5],
  defaultZoom: 7,
  bounds: [
    [15.4, 72.4],
    [22.4, 80.9],
  ],
  districtPropertyKey: "district",
  districtRegions,
  regionLabels: {
    konkan: "Konkan Coast",
    nashik: "Nashik Division",
    pune: "Pune Division",
    marathwada: "Marathwada",
    amravati: "Amravati Division",
    nagpur: "Nagpur Division",
  },
  geoJson: districtsGeoJson,
};

import type { Feature, FeatureCollection, Geometry } from "geojson";
import { feature as topoToGeo } from "topojson-client";
import world from "./world-topo.json";
import countriesReference from "./countries-reference.json";

type WorldTopology = typeof world;

export type CountryFeature = Feature<Geometry, Record<string, unknown>> & {
  id?: string | number;
};

export function loadWorldTopology(): WorldTopology {
  return world as WorldTopology;
}

let cachedCountries: FeatureCollection | null = null;
let cachedList:
  | Array<{
      id: string;
      name: string;
    }>
  | null = null;
let cachedNameMap: Map<string, string> | null = null;
const featureIdCache = new WeakMap<CountryFeature, string>();

const INVALID_CODES = new Set(["", "-99", "UNK", "???", "TWN"]);

function normalizeCode(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const upper = trimmed.toUpperCase();
  if (INVALID_CODES.has(upper)) return undefined;
  // treat purely numeric codes as invalid so we can prefer human-readable slugs
  if (!/[A-Z]/.test(upper)) return undefined;
  return upper;
}

function slugifyName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getWorldCountries(): FeatureCollection {
  if (cachedCountries) return cachedCountries;
  const topology = loadWorldTopology();
  const object = (topology.objects as Record<string, unknown>)["countries"];
  if (!object) {
    throw new Error("Topology missing countries collection");
  }
  // @ts-expect-error topojson type is lenient here at runtime
  const features = topoToGeo(topology, object) as FeatureCollection;
  cachedCountries = features;
  return cachedCountries;
}

export function getCountryId(country: CountryFeature): string {
  const cached = featureIdCache.get(country);
  if (cached) return cached;

  const props = (country.properties || {}) as Record<string, unknown>;
  const name = getCountryName(country);
  
  // First, try to match with reference list to get canonical ID
  const matchedRefName = findCountryInReference(name);
  if (matchedRefName) {
    const refId = slugifyName(matchedRefName).toUpperCase();
    featureIdCache.set(country, refId);
    return refId;
  }
  
  // Fallback to original logic for territories/unknown countries
  const slug = name ? slugifyName(name) : undefined;

  const candidates = [
    normalizeCode(props["ISO_A3"]),
    normalizeCode(props["ADM0_A3"]),
    normalizeCode(props["ISO_A3_EH"]),
    normalizeCode(props["iso_a3"]),
    normalizeCode(props["iso_a3_eh"]),
    normalizeCode(props["WB_A3"]),
    normalizeCode(props["SU_A3"]),
    normalizeCode(props["gu_a3"]),
    normalizeCode(props["FIPS_10"]),
    normalizeCode(props["SOV_A3"]),
    normalizeCode(typeof country.id === "number" ? country.id.toString() : country.id)
  ];

  const canonical =
    candidates.find((code) => code && !INVALID_CODES.has(code)) ||
    (slug ? slug.toUpperCase() : undefined);

  if (canonical) {
    featureIdCache.set(country, canonical);
    return canonical;
  }

  // Final deterministic fallback based on geometry length
  const geomHash =
    (country.geometry && "coordinates" in country.geometry
      ? JSON.stringify(country.geometry.coordinates).length
      : Math.random().toString(36).slice(2));
  const fallback = `ID-${geomHash}`;
  featureIdCache.set(country, fallback);
  return fallback;
}

export function getCountryName(country: CountryFeature): string {
  const props = (country.properties || {}) as Record<string, unknown>;
  return (
    (props["name"] as string | undefined) ||
    (props["NAME"] as string | undefined) ||
    (props["NAME_LONG"] as string | undefined) ||
    (props["GEOUNIT"] as string | undefined) ||
    "Unknown territory"
  );
}

function findCountryInReference(name: string): string | null {
  const referenceCountries = countriesReference.allCountries as string[];
  const nameVariants = countriesReference.nameVariants as Record<string, string[]>;
  
  const normalized = name.trim();
  
  // Direct match
  if (referenceCountries.includes(normalized)) {
    return normalized;
  }
  
  // Check name variants
  for (const [canonical, variants] of Object.entries(nameVariants)) {
    if (variants.includes(normalized)) {
      return canonical;
    }
  }
  
  // Case-insensitive match
  const lower = normalized.toLowerCase();
  for (const refName of referenceCountries) {
    if (refName.toLowerCase() === lower) {
      return refName;
    }
  }
  
  return null;
}

export function getWorldCountryList() {
  if (cachedList) return cachedList;
  
  // Use ONLY the 195 countries from the reference list
  // This ensures we don't include territories, dependencies, or duplicates
  const referenceCountries = countriesReference.allCountries as string[];
  
  cachedList = referenceCountries
    .map((countryName) => ({
      id: slugifyName(countryName).toUpperCase(),
      name: countryName,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  return cachedList;
}

export function getCountryNameById(id: string) {
  if (!cachedNameMap) {
    cachedNameMap = new Map(getWorldCountryList().map((entry) => [entry.id, entry.name]));
  }
  return cachedNameMap.get(id) ?? id;
}


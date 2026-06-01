// Builds the projected world geometry for the native renderer.
//
// This is the part that ports cleanly from the web app: d3-geo is pure math
// and runs unchanged under Hermes. react-simple-maps used geoEqualEarth and
// rendered SVG paths to the DOM; here we use the same projection but ask
// d3-geo's geoPath for raw SVG path-strings, which react-native-svg can draw.
import { geoEqualEarth, geoPath, geoCentroid } from "d3-geo";
import type { GeoProjection } from "d3-geo";
import {
  getWorldCountries,
  getCountryId,
  getCountryName,
} from "../core/map";

export type ProjectedCountry = {
  id: string;
  name: string;
  /** SVG path data in projected pixel space. */
  d: string;
  /** Geographic centroid [lon, lat] used for label / emoji placement. */
  centroid: [number, number];
};

export type Geography = {
  projection: GeoProjection;
  countries: ProjectedCountry[];
  width: number;
  height: number;
};

// Manual centroid nudges ported verbatim from the web MapView — geoCentroid
// of a multi-polygon country can fall in the ocean (e.g. France with its
// overseas territories), so these place the marker on the mainland.
const CENTROID_ADJUSTMENTS: Record<string, [number, number]> = {
  FRA: [2, 46.5],
  FRANCE: [2, 46.5],
  USA: [-98, 38],
  RUS: [95, 60],
  CAN: [-95, 60],
  AUS: [133, -27],
  NZL: [174, -41],
  GBR: [-2, 54],
  NOR: [9, 61],
  DNK: [10, 56],
  NLD: [5.5, 52.2],
  PRT: [-8, 39.5],
  ESP: [-3.5, 40],
  ITA: [12.5, 42.5],
  CHL: [-71, -35],
  ECU: [-78.5, -1.5],
  CHN: [105, 35],
  CHINA: [105, 35],
};

const cache = new Map<string, Geography>();

/**
 * Project the world topology to fit a width x height viewport. Memoized by
 * size, so rotation / layout changes recompute but steady state is free.
 */
export function buildGeography(width: number, height: number): Geography {
  const key = `${Math.round(width)}x${Math.round(height)}`;
  const cached = cache.get(key);
  if (cached) return cached;

  // Fit the whole globe (Sphere) into the viewport, centered.
  const projection = geoEqualEarth().fitSize([width, height], {
    type: "Sphere",
  } as any);

  const path = geoPath(projection);
  const fc = getWorldCountries();

  const countries: ProjectedCountry[] = [];
  for (const feature of fc.features) {
    const d = path(feature as any);
    if (!d) continue; // skip features that don't project
    const id = getCountryId(feature as any);
    const name = getCountryName(feature as any);

    let centroid: [number, number];
    const adjusted = CENTROID_ADJUSTMENTS[id];
    if (adjusted) {
      centroid = adjusted;
    } else {
      try {
        const c = geoCentroid(feature as any);
        centroid =
          c && !isNaN(c[0]) && !isNaN(c[1]) ? [c[0], c[1]] : [0, 0];
      } catch {
        centroid = [0, 0];
      }
    }

    countries.push({ id, name, d, centroid });
  }

  const geography: Geography = { projection, countries, width, height };
  cache.set(key, geography);
  return geography;
}

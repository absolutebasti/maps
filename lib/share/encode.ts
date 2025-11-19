/**
 * Encode and decode map state for shareable URLs
 */

import type { CountryData } from "../state/store";

export type ShareableMapState = {
  // List of visited country IDs (compressed)
  v: string[]; // visited country IDs
  // Selected country ID (optional)
  s?: string; // selected country ID
  // Visited country color (optional)
  c?: string; // color (hex)
};

/**
 * Encode map state to a URL-safe string
 * Uses base64url encoding for compact representation
 */
export function encodeMapState(state: ShareableMapState): string {
  try {
    // Convert to JSON and compress
    const json = JSON.stringify(state);
    // Use base64url encoding (URL-safe)
    const encoded = btoa(json)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    return encoded;
  } catch (error) {
    console.error("Error encoding map state:", error);
    throw new Error("Failed to encode map state");
  }
}

/**
 * Decode a URL-safe string back to map state
 */
export function decodeMapState(encoded: string): ShareableMapState | null {
  try {
    // Restore base64 padding if needed
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding
    while (base64.length % 4) {
      base64 += "=";
    }
    // Decode
    const json = atob(base64);
    const state = JSON.parse(json) as ShareableMapState;
    return state;
  } catch (error) {
    console.error("Error decoding map state:", error);
    return null;
  }
}

/**
 * Convert app state to shareable state
 * Only includes essential data for sharing
 */
export function createShareableState(
  countriesById: Record<string, CountryData>,
  selectedCountryId?: string,
  visitedCountryColor?: string
): ShareableMapState {
  // Get list of visited country IDs
  const visitedIds = Object.values(countriesById)
    .filter((country) => country.visited)
    .map((country) => country.id)
    .sort(); // Sort for consistent encoding

  const state: ShareableMapState = {
    v: visitedIds,
  };

  // Add selected country if provided
  if (selectedCountryId) {
    state.s = selectedCountryId;
  }

  // Add color if it's not the default
  if (visitedCountryColor && visitedCountryColor !== "#E8DCC4") {
    state.c = visitedCountryColor;
  }

  return state;
}

/**
 * Generate a shareable URL with encoded map state
 */
export function generateShareUrl(
  baseUrl: string,
  state: ShareableMapState,
  source: string = "share"
): string {
  const encoded = encodeMapState(state);
  const shareId = encoded;
  return `${baseUrl}/share/${shareId}?utm_source=${source}&utm_medium=social&utm_campaign=map_share`;
}

/**
 * Generate a deep link to a specific country
 */
export function generateCountryDeepLink(
  baseUrl: string,
  countryId: string,
  visitedCountries: string[] = []
): string {
  const state: ShareableMapState = {
    v: visitedCountries,
    s: countryId, // Selected country
  };
  return generateShareUrl(baseUrl, state, "deep_link");
}


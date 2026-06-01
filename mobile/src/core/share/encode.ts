/**
 * Encode and decode map state for shareable URLs / deep links.
 *
 * Ported from the web app. The browser-only btoa/atob are replaced with a
 * small self-contained base64 implementation so this runs unchanged under
 * Hermes (React Native), where those globals are not available.
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

const B64_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/** UTF-8 safe base64 encode (replacement for btoa). */
function base64Encode(input: string): string {
  // Encode the string as UTF-8 bytes first so non-ASCII content is safe.
  const utf8 = unescape(encodeURIComponent(input));
  let output = "";
  for (let i = 0; i < utf8.length; i += 3) {
    const c1 = utf8.charCodeAt(i);
    const c2 = utf8.charCodeAt(i + 1);
    const c3 = utf8.charCodeAt(i + 2);
    const e1 = c1 >> 2;
    const e2 = ((c1 & 3) << 4) | (c2 >> 4);
    const e3 = isNaN(c2) ? 64 : ((c2 & 15) << 2) | (c3 >> 6);
    const e4 = isNaN(c3) ? 64 : c3 & 63;
    output +=
      B64_CHARS.charAt(e1) +
      B64_CHARS.charAt(e2) +
      B64_CHARS.charAt(e3) +
      B64_CHARS.charAt(e4);
  }
  return output;
}

/** UTF-8 safe base64 decode (replacement for atob). */
function base64Decode(input: string): string {
  const clean = input.replace(/[^A-Za-z0-9+/=]/g, "");
  let output = "";
  for (let i = 0; i < clean.length; i += 4) {
    const e1 = B64_CHARS.indexOf(clean.charAt(i));
    const e2 = B64_CHARS.indexOf(clean.charAt(i + 1));
    const e3 = B64_CHARS.indexOf(clean.charAt(i + 2));
    const e4 = B64_CHARS.indexOf(clean.charAt(i + 3));
    const c1 = (e1 << 2) | (e2 >> 4);
    const c2 = ((e2 & 15) << 4) | (e3 >> 2);
    const c3 = ((e3 & 3) << 6) | e4;
    output += String.fromCharCode(c1);
    if (e3 !== 64) output += String.fromCharCode(c2);
    if (e4 !== 64) output += String.fromCharCode(c3);
  }
  // Reverse the UTF-8 byte expansion done in base64Encode.
  return decodeURIComponent(escape(output));
}

/**
 * Encode map state to a URL-safe string (base64url).
 */
export function encodeMapState(state: ShareableMapState): string {
  try {
    const json = JSON.stringify(state);
    const encoded = base64Encode(json)
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
 * Decode a URL-safe string back to map state.
 */
export function decodeMapState(encoded: string): ShareableMapState | null {
  try {
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const json = base64Decode(base64);
    const state = JSON.parse(json) as ShareableMapState;
    return state;
  } catch (error) {
    console.error("Error decoding map state:", error);
    return null;
  }
}

/**
 * Convert app state to shareable state. Only includes essential data.
 */
export function createShareableState(
  countriesById: Record<string, CountryData>,
  selectedCountryId?: string,
  visitedCountryColor?: string
): ShareableMapState {
  const visitedIds = Object.values(countriesById)
    .filter((country) => country.visited)
    .map((country) => country.id)
    .sort();

  const state: ShareableMapState = {
    v: visitedIds,
  };

  if (selectedCountryId) {
    state.s = selectedCountryId;
  }

  if (visitedCountryColor && visitedCountryColor !== "#E8DCC4") {
    state.c = visitedCountryColor;
  }

  return state;
}

/**
 * Generate a shareable URL with encoded map state. Defaults to the web
 * origin so existing share links keep working; with Universal Links the
 * same URL can open the native app when installed.
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
 * Generate a deep link to a specific country.
 */
export function generateCountryDeepLink(
  baseUrl: string,
  countryId: string,
  visitedCountries: string[] = []
): string {
  const state: ShareableMapState = {
    v: visitedCountries,
    s: countryId,
  };
  return generateShareUrl(baseUrl, state, "deep_link");
}

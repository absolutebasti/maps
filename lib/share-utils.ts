/**
 * Utility functions for sharing with UTM tracking
 */

/**
 * Build a share URL with UTM parameters for tracking
 * @param baseUrl - The base URL to share
 * @param source - The source of the share (e.g., 'web_share', 'clipboard', 'download')
 * @param medium - The medium of the share (default: 'social')
 * @param campaign - The campaign name (default: 'map_share')
 */
export function buildShareUrl(
  baseUrl: string,
  source: string = "web_share",
  medium: string = "social",
  campaign: string = "map_share"
): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", medium);
    url.searchParams.set("utm_campaign", campaign);
    return url.toString();
  } catch {
    // If URL parsing fails, append as query string
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`;
  }
}

/**
 * Get the base URL of the site
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Fallback for SSR
  return process.env.NEXT_PUBLIC_SITE_URL || "https://maps-production-d32c.up.railway.app";
}

/**
 * Get a shareable URL with UTM parameters
 * @param source - The source of the share
 */
export function getShareableUrl(source: string = "web_share"): string {
  const baseUrl = getBaseUrl();
  return buildShareUrl(baseUrl, source, "social", "map_share");
}


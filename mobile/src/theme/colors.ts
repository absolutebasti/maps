// Color tokens for the native app.
//
// The map's visual identity is ported from the web MapView: the same ocean
// blue, unvisited/hover greys, selection stroke, and ocean-label color, so
// the native map reads as the same product. The default visited color and
// fill pattern live in the Zustand store's settings (visitedCountryColor).
export const colors = {
  // Ocean / map background
  ocean: "#A8D8EA",
  oceanWaveStrong: "rgba(255,255,255,0.15)",
  oceanWaveFaint: "rgba(255,255,255,0.08)",
  oceanLabel: "#4A7C8C",

  // Countries
  unvisited: "#E5E7EB",
  unvisitedHover: "#D1D5DB",
  countryStroke: "#9CA3AF",
  selectedStroke: "#8B7355",

  // App chrome
  statsBg: "rgba(0,0,0,0.9)",
  statsText: "#FFFFFF",
  statsSubText: "#D1D5DB",
  tooltipBg: "rgba(0,0,0,0.95)",
  tooltipText: "#FFFFFF",
  tooltipSubText: "#D1D5DB",
  tooltipNoteText: "#9CA3AF",
  tooltipDivider: "#374151",
  star: "#FCD34D",
  starEmpty: "#4B5563",

  buttonBg: "#FFFFFF",
  buttonBorder: "#D1D5DB",
  buttonText: "#1F2937",
  buttonDisabled: "#9CA3AF",
} as const;

// The 15 quick-pick visited colors from the web Legend, kept here so the
// color picker (later phase) and any defaults stay consistent.
export const VISITED_COLOR_SWATCHES = [
  "#F87171", // red
  "#FB923C", // orange
  "#FBBF24", // amber
  "#A3E635", // lime
  "#34D399", // emerald
  "#22D3EE", // cyan
  "#60A5FA", // blue
  "#818CF8", // indigo
  "#A78BFA", // violet
  "#E879F9", // fuchsia
  "#FB7185", // rose
  "#94A3B8", // slate
  "#78716C", // stone
  "#E8DCC4", // sand (legacy default)
  "#1F2937", // ink
] as const;

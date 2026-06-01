// Light / dark theme tokens for the app chrome (screens, lists, sheets, tab
// bar). The map canvas itself keeps its fixed look in both themes, matching the
// web app where dark mode only restyled the surrounding UI.
export type ThemeColors = {
  bg: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  inputBg: string;
  inputBorder: string;
  placeholder: string;
  primary: string;
  primaryText: string;
  muted: string;
  mutedText: string;
  rowVisitedBg: string;
  danger: string;
  dangerBg: string;
  backdrop: string;
};

export const lightColors: ThemeColors = {
  bg: "#FFFFFF",
  card: "#FFFFFF",
  text: "#111827",
  subtext: "#6B7280",
  border: "#E5E7EB",
  inputBg: "#FFFFFF",
  inputBorder: "#E5E7EB",
  placeholder: "#9CA3AF",
  primary: "#111827",
  primaryText: "#FFFFFF",
  muted: "#F3F4F6",
  mutedText: "#374151",
  rowVisitedBg: "#F0FDF4",
  danger: "#DC2626",
  dangerBg: "#FEF2F2",
  backdrop: "rgba(0,0,0,0.4)",
};

export const darkColors: ThemeColors = {
  bg: "#0B1220",
  card: "#111827",
  text: "#F3F4F6",
  subtext: "#9CA3AF",
  border: "#1F2937",
  inputBg: "#111827",
  inputBorder: "#374151",
  placeholder: "#6B7280",
  primary: "#F9FAFB",
  primaryText: "#111827",
  muted: "#1F2937",
  mutedText: "#D1D5DB",
  rowVisitedBg: "#0F2A1E",
  danger: "#F87171",
  dangerBg: "#2A1416",
  backdrop: "rgba(0,0,0,0.6)",
};

export const fonts = {
  regular: "LemonMilk-Regular",
  medium: "LemonMilk-Medium",
  bold: "LemonMilk-Bold",
} as const;

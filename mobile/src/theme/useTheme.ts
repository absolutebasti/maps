// Resolves the effective color scheme from the user's stored preference
// (light / dark / system) and the OS appearance, and returns the matching
// token set. Components call `const { c } = useTheme()` and read `c.bg` etc.
import { useColorScheme } from "react-native";
import { useAppStore } from "../core/state/store";
import { lightColors, darkColors, type ThemeColors } from "./tokens";

export function useTheme(): {
  scheme: "light" | "dark";
  c: ThemeColors;
  pref: "light" | "dark" | "system";
} {
  const pref = useAppStore((s) => s.settings.theme);
  const system = useColorScheme();
  const scheme: "light" | "dark" =
    pref === "system" ? (system === "dark" ? "dark" : "light") : pref;
  return { scheme, c: scheme === "dark" ? darkColors : lightColors, pref };
}

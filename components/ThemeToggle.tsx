"use client";

import { useEffect } from "react";
import { useAppStore } from "./../lib/state/store";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const settings = useAppStore((s) => s.settings);
  const setState = useAppStore.setState;

  const applyTheme = (theme: "light" | "dark") => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  };

  useEffect(() => {
    // If theme is "system", convert to "light" on first load
    const currentTheme = settings.theme === "system" ? "light" : settings.theme;
    applyTheme(currentTheme);
    if (settings.theme === "system") {
      setState((prev) => ({ ...prev, settings: { ...prev.settings, theme: "light" } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.theme]);

  const cycle = () => {
    const currentTheme = settings.theme === "system" ? "light" : settings.theme;
    const next = currentTheme === "light" ? "dark" : "light";
    setState((prev) => ({ ...prev, settings: { ...prev.settings, theme: next } }));
  };

  const currentTheme = settings.theme === "system" ? "light" : settings.theme;

  return (
    <Button variant="ghost" onClick={cycle} title={`Theme: ${currentTheme}`}>
      {currentTheme === "light" ? "🌞" : "🌙"}
    </Button>
  );
}



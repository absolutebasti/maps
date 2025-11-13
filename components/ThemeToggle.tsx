"use client";

import { useEffect } from "react";
import { useAppStore } from "./../lib/state/store";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const settings = useAppStore((s) => s.settings);
  const setState = useAppStore.setState;

  const applyTheme = (theme: "light" | "dark" | "system") => {
    const root = document.documentElement;
    const preferDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", preferDark);
  };

  useEffect(() => {
    applyTheme(settings.theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.theme]);

  const cycle = () => {
    const order: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const idx = order.indexOf(settings.theme);
    const next = order[(idx + 1) % order.length];
    setState((prev) => ({ ...prev, settings: { ...prev.settings, theme: next } }));
  };

  return (
    <Button variant="ghost" onClick={cycle} title={`Theme: ${settings.theme}`}>
      {settings.theme === "light" ? "🌞" : settings.theme === "dark" ? "🌙" : "💻"}
    </Button>
  );
}



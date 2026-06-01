"use client";

import { useEffect } from "react";
import { useAppStore } from "./../lib/state/store";
import { loadFromLocalStorage, saveToLocalStorage } from "./../lib/persist/local";
import type { CountryData } from "./../lib/state/store";

const DUPLICATE_CODE_REGEX = /^([A-Z]{2,4})-(\d+)$/;

function normalizeCountryId(id: string) {
  const match = id.match(DUPLICATE_CODE_REGEX);
  if (match) {
    return match[1];
  }
  return id;
}

function mergeCountryData(base: CountryData | undefined, next: CountryData): CountryData {
  if (!base) {
    return next;
  }
  return {
    ...base,
    ...next,
    visited: base.visited || next.visited,
    tags: Array.from(new Set([...(base.tags ?? []), ...(next.tags ?? [])])),
    id: next.id
  };
}

export function StorePersistence() {
  const snapshot = useAppStore((s) => ({
    countriesById: s.countriesById,
    tagsById: s.tagsById,
    settings: s.settings
  }));
  const hydrate = useAppStore.setState;

  useEffect(() => {
    const loaded = loadFromLocalStorage();
    if (loaded) {
      const normalizedCountries: Record<string, CountryData> = {};
      for (const [id, country] of Object.entries(loaded.countriesById)) {
        const normalizedId = normalizeCountryId(id);
        const data: CountryData = { ...country, id: normalizedId };
        normalizedCountries[normalizedId] = mergeCountryData(normalizedCountries[normalizedId], data);
      }

      hydrate((prev) => ({
        ...prev,
        countriesById: normalizedCountries,
        tagsById: loaded.tagsById,
        settings: loaded.settings
      }));
      // apply theme on hydration
      const root = document.documentElement;
      const theme = loaded.settings.theme;
      const preferDark =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", preferDark);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveToLocalStorage(snapshot);
  }, [snapshot]);

  return null;
}



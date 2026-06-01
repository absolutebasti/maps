import type { CountryData, TagData, Settings } from "./../state/store";

const STORAGE_KEY = "mymap.v1";

export type PersistedState = {
  countriesById: Record<string, CountryData>;
  tagsById: Record<string, TagData>;
  settings: Settings;
};

export function saveToLocalStorage(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function loadFromLocalStorage(): PersistedState | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return;
  }
}



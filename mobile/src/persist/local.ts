// Local persistence for React Native, backed by AsyncStorage.
//
// Mirrors the web app's lib/persist/local.ts (which used localStorage),
// keeping the same versioned storage key and PersistedState shape so the
// data model stays identical across web and native.
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CountryData, TagData, Settings } from "../core/state/store";

const STORAGE_KEY = "mymap.v1";

export type PersistedState = {
  countriesById: Record<string, CountryData>;
  tagsById: Record<string, TagData>;
  settings: Settings;
};

export async function saveToLocalStorage(state: PersistedState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore write failures (storage full / unavailable)
  }
}

export async function loadFromLocalStorage(): Promise<PersistedState | undefined> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return undefined;
  }
}

export async function clearLocalStorage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

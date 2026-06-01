// Hydrate the Zustand store from AsyncStorage on launch, then persist any
// changes back (debounced). This is the RN replacement for the web app's
// StorePersistence.tsx, which used localStorage + a render-time effect.
import { useEffect, useState } from "react";
import { useAppStore } from "../core/state/store";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  type PersistedState,
} from "./local";

const SAVE_DEBOUNCE_MS = 400;

export function usePersistence(): { hydrated: boolean } {
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state once on launch.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const persisted = await loadFromLocalStorage();
      if (!cancelled && persisted) {
        useAppStore.setState((s) => ({
          countriesById: persisted.countriesById ?? s.countriesById,
          tagsById: persisted.tagsById ?? s.tagsById,
          settings: { ...s.settings, ...persisted.settings },
        }));
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // After hydration, persist on every relevant change (debounced).
  useEffect(() => {
    if (!hydrated) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const unsubscribe = useAppStore.subscribe((state) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const snapshot: PersistedState = {
          countriesById: state.countriesById,
          tagsById: state.tagsById,
          settings: state.settings,
        };
        void saveToLocalStorage(snapshot);
      }, SAVE_DEBOUNCE_MS);
    });

    return () => {
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, [hydrated]);

  return { hydrated };
}

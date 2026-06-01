// Auth + cloud-sync provider — native port of the web AuthProvider.
//
// Tracks the signed-in Supabase user and wires the (already-ported) cloud sync:
//   - on login: load cloud data, merge with local (cloud-prefer), write back
//   - on any local change while logged in: debounced saveToCloud
// All sync logic (loadFromCloud / saveToCloud / mergeData) is reused unchanged.
// With no Supabase env configured, `supabase` is null and this is a no-op.
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "../core/supabase/client";
import { getCurrentUser, onAuthStateChange } from "../core/supabase/auth";
import { loadFromCloud, saveToCloud, mergeData } from "../core/supabase/sync";
import { useAppStore } from "../core/state/store";

export type SyncStatus = "idle" | "syncing" | "synced" | "error";

type AuthContextValue = {
  user: User | null;
  syncStatus: SyncStatus;
  configured: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  syncStatus: "idle",
  configured: false,
  refresh: async () => {},
});

const SYNC_DEBOUNCE_MS = 2000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

  const refresh = useCallback(async () => {
    setUser(await getCurrentUser());
  }, []);

  // Initial session + auth-state subscription.
  useEffect(() => {
    if (!supabase) return;
    void refresh();
    const sub = onAuthStateChange(setUser);
    return () => sub.unsubscribe();
  }, [refresh]);

  // On login: pull cloud, merge with local, push merged back.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setSyncStatus("syncing");
      const { data, error } = await loadFromCloud(user.id);
      if (cancelled) return;
      if (error) {
        setSyncStatus("error");
        return;
      }
      const s = useAppStore.getState();
      const merged = mergeData(data, {
        countriesById: s.countriesById,
        tagsById: s.tagsById,
        settings: s.settings,
      });
      useAppStore.setState({
        countriesById: merged.countriesById,
        tagsById: merged.tagsById,
        settings: merged.settings,
      });
      const res = await saveToCloud(user.id, merged);
      if (!cancelled) setSyncStatus(res.error ? "error" : "synced");
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // While logged in: debounce-save local changes to the cloud.
  useEffect(() => {
    if (!user) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const unsub = useAppStore.subscribe((state) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        setSyncStatus("syncing");
        const { error } = await saveToCloud(user.id, {
          countriesById: state.countriesById,
          tagsById: state.tagsById,
          settings: state.settings,
        });
        setSyncStatus(error ? "error" : "synced");
      }, SYNC_DEBOUNCE_MS);
    });
    return () => {
      if (timer) clearTimeout(timer);
      unsub();
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, syncStatus, configured: !!supabase, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

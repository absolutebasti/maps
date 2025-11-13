"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/state/store";
import { syncCountriesToSupabase, updateUserSettings } from "@/lib/supabase/api";

/**
 * Component that syncs Zustand store changes to Supabase
 * This ensures user data is always backed up to the cloud
 */
export function SupabaseSync() {
  const user = useAppStore((s) => s.user);
  const countriesById = useAppStore((s) => s.countriesById);
  const settings = useAppStore((s) => s.settings);
  
  const syncTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSyncedCountriesRef = useRef<string>("");
  const lastSyncedSettingsRef = useRef<string>("");

  // Sync countries when they change
  useEffect(() => {
    if (!user) return;

    const currentCountriesHash = JSON.stringify(countriesById);
    
    // Skip if no changes
    if (currentCountriesHash === lastSyncedCountriesRef.current) {
      return;
    }

    // Debounce: wait 2 seconds after last change before syncing
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await syncCountriesToSupabase(countriesById);
        lastSyncedCountriesRef.current = currentCountriesHash;
        console.log("✅ Countries synced to Supabase");
      } catch (error) {
        console.error("❌ Error syncing countries to Supabase:", error);
      }
    }, 2000);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [user, countriesById]);

  // Sync settings when they change
  useEffect(() => {
    if (!user) return;

    const currentSettingsHash = JSON.stringify(settings);
    
    // Skip if no changes
    if (currentSettingsHash === lastSyncedSettingsRef.current) {
      return;
    }

    // Debounce: wait 1 second after last change before syncing
    const timeout = setTimeout(async () => {
      try {
        await updateUserSettings(settings);
        lastSyncedSettingsRef.current = currentSettingsHash;
        console.log("✅ Settings synced to Supabase");
      } catch (error) {
        console.error("❌ Error syncing settings to Supabase:", error);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [user, settings]);

  return null; // This component doesn't render anything
}


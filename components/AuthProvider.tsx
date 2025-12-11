"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, onAuthStateChange } from "../lib/supabase/auth";
import { loadFromCloud, saveToCloud, mergeData } from "../lib/supabase/sync";
import { useAppStore, PREDEFINED_TAGS } from "../lib/state/store";
import { loadFromLocalStorage, saveToLocalStorage } from "../lib/persist/local";

type SyncStatus = "idle" | "syncing" | "synced" | "error";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    syncStatus: SyncStatus;
    refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    syncStatus: "idle",
    refreshAuth: async () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
    const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSyncedRef = useRef<string>("");

    // Load data from cloud when user logs in
    const loadUserData = useCallback(async (userId: string) => {
        setSyncStatus("syncing");

        try {
            const { data: cloudData, error } = await loadFromCloud(userId);

            if (error) {
                console.error("Error loading cloud data:", error);
                setSyncStatus("error");
                return;
            }

            // Get current local state
            const localState = loadFromLocalStorage();
            const localData = localState ? {
                countriesById: localState.countriesById || {},
                tagsById: localState.tagsById || PREDEFINED_TAGS.reduce((acc, tag) => ({ ...acc, [tag.id]: tag }), {}),
                settings: localState.settings || {
                    theme: "light",
                    showLegend: true,
                    showLabels: false,
                    visitedCountryColor: "#E8DCC4",
                },
            } : {
                countriesById: {},
                tagsById: PREDEFINED_TAGS.reduce((acc, tag) => ({ ...acc, [tag.id]: tag }), {}),
                settings: {
                    theme: "light" as const,
                    showLegend: true,
                    showLabels: false,
                    visitedCountryColor: "#E8DCC4",
                },
            };

            // Merge cloud and local data
            const mergedData = mergeData(cloudData, localData);

            // Update the store with merged data
            useAppStore.setState({
                countriesById: mergedData.countriesById,
                tagsById: mergedData.tagsById,
                settings: mergedData.settings,
            });

            // Save merged data back to cloud
            await saveToCloud(userId, mergedData);

            // Also save to local storage as backup
            saveToLocalStorage({
                countriesById: mergedData.countriesById,
                tagsById: mergedData.tagsById,
                settings: mergedData.settings,
            });

            setSyncStatus("synced");
            lastSyncedRef.current = JSON.stringify(mergedData.countriesById);
        } catch (err) {
            console.error("Error in loadUserData:", err);
            setSyncStatus("error");
        }
    }, []);

    // Sync store changes to cloud (debounced)
    const syncToCloud = useCallback(async () => {
        if (!user) return;

        const state = useAppStore.getState();
        const currentData = JSON.stringify(state.countriesById);

        // Skip if no changes
        if (currentData === lastSyncedRef.current) return;

        setSyncStatus("syncing");

        try {
            const { error } = await saveToCloud(user.id, {
                countriesById: state.countriesById,
                tagsById: state.tagsById,
                settings: state.settings,
            });

            if (error) {
                console.error("Sync error:", error);
                setSyncStatus("error");
            } else {
                setSyncStatus("synced");
                lastSyncedRef.current = currentData;
            }
        } catch (err) {
            console.error("Sync error:", err);
            setSyncStatus("error");
        }
    }, [user]);

    // Debounced sync - wait 2 seconds after last change
    const debouncedSync = useCallback(() => {
        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
        }
        syncTimeoutRef.current = setTimeout(syncToCloud, 2000);
    }, [syncToCloud]);

    // Subscribe to store changes
    useEffect(() => {
        if (!user) return;

        const unsubscribe = useAppStore.subscribe(() => {
            debouncedSync();
        });

        return () => {
            unsubscribe();
            if (syncTimeoutRef.current) {
                clearTimeout(syncTimeoutRef.current);
            }
        };
    }, [user, debouncedSync]);

    // Initialize auth state
    useEffect(() => {
        let mounted = true;

        const init = async () => {
            const currentUser = await getCurrentUser();
            if (mounted) {
                setUser(currentUser);
                if (currentUser) {
                    await loadUserData(currentUser.id);
                }
                setLoading(false);
            }
        };

        init();

        // Listen for auth changes
        const { unsubscribe } = onAuthStateChange(async (newUser) => {
            if (mounted) {
                setUser(newUser);
                if (newUser) {
                    await loadUserData(newUser.id);
                } else {
                    setSyncStatus("idle");
                }
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, [loadUserData]);

    const refreshAuth = useCallback(async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
            await loadUserData(currentUser.id);
        }
    }, [loadUserData]);

    return (
        <AuthContext.Provider value={{ user, loading, syncStatus, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

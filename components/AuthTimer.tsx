"use client";

import { useEffect, useState } from "react";
import { AuthModal } from "./AuthModal";
import { useAppStore } from "./../lib/state/store";
import { createClient } from "@/lib/supabase/client";
import { fetchUserCountries, fetchUserSettings } from "@/lib/supabase/api";

const AUTH_TIMER_DURATION = 15000; // 15 seconds

export function AuthTimer() {
  const [showModal, setShowModal] = useState(false);
  const user = useAppStore((s) => s.user);
  const hasSeenAuthModal = useAppStore((s) => s.hasSeenAuthModal);
  const setUser = useAppStore((s) => s.setUser);
  const setHasSeenAuthModal = useAppStore((s) => s.setHasSeenAuthModal);
  const countriesById = useAppStore((s) => s.countriesById);

  useEffect(() => {
    const supabase = createClient();

    // Check for existing Supabase session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userName = session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User";
        setUser({
          email: session.user.email || "",
          name: userName,
          loggedInAt: new Date().toISOString(),
        });
        setHasSeenAuthModal(true);

        // Sync user data from Supabase
        try {
          const userCountries = await fetchUserCountries();
          const userSettings = await fetchUserSettings();
          
          // Merge with local data (Zustand store will handle this)
          if (Object.keys(userCountries).length > 0) {
            // Update store with fetched countries
            useAppStore.setState({ countriesById: userCountries });
          }
          
          if (userSettings) {
            useAppStore.setState((s) => ({
              settings: { ...s.settings, ...userSettings }
            }));
          }
        } catch (error) {
          console.error("Error syncing user data:", error);
        }
        
        return;
      }

      // If user is logged in or has seen the modal, don't show it
      if (user || hasSeenAuthModal) {
        return;
      }

      // Set timer to show modal after 15 seconds
      const timer = setTimeout(() => {
        setShowModal(true);
        setHasSeenAuthModal(true);
      }, AUTH_TIMER_DURATION);

      return () => clearTimeout(timer);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const userName = session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User";
        setUser({
          email: session.user.email || "",
          name: userName,
          loggedInAt: new Date().toISOString(),
        });
        
        // Sync user data after sign in
        try {
          const userCountries = await fetchUserCountries();
          const userSettings = await fetchUserSettings();
          
          if (Object.keys(userCountries).length > 0) {
            useAppStore.setState({ countriesById: userCountries });
          }
          
          if (userSettings) {
            useAppStore.setState((s) => ({
              settings: { ...s.settings, ...userSettings }
            }));
          }
        } catch (error) {
          console.error("Error syncing user data:", error);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(undefined);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, hasSeenAuthModal, setUser, setHasSeenAuthModal, countriesById]);

  const handleAuthSuccess = async (email: string, name: string) => {
    setUser({
      email,
      name,
      loggedInAt: new Date().toISOString(),
    });
    setShowModal(false);

    // Sync local data to Supabase after successful auth
    try {
      const { syncCountriesToSupabase, updateUserSettings } = await import("@/lib/supabase/api");
      
      // Sync countries if any exist locally
      if (Object.keys(countriesById).length > 0) {
        await syncCountriesToSupabase(countriesById);
      }

      // Sync settings
      const settings = useAppStore.getState().settings;
      await updateUserSettings(settings);
    } catch (error) {
      console.error("Error syncing data to Supabase:", error);
    }
  };

  const handleClose = () => {
    // Don't allow closing without auth for now
    // You can customize this behavior
  };

  return (
    <AuthModal
      isOpen={showModal && !user}
      onClose={handleClose}
      onSuccess={handleAuthSuccess}
    />
  );
}


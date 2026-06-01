// Deep-link handling (replaces the web /share/[id] and /auth/confirm routes).
//   - mymap://share/<id>            -> decode a shared map and offer to add it
//   - mymap://auth/confirm?code=... -> complete Supabase email confirmation
// Works for both the custom scheme and (if Universal Links are configured) the
// web https URLs, which carry the same /share/<id> and /auth/confirm paths.
import { useEffect } from "react";
import { Alert } from "react-native";
import * as Linking from "expo-linking";

import { decodeMapState } from "../core/share/encode";
import { useAppStore } from "../core/state/store";
import { getCountryNameById } from "../core/map";
import { supabase } from "../core/supabase/client";
import { useAuth } from "../auth/AuthProvider";

export function useDeepLinks() {
  const url = Linking.useURL();
  const { refresh } = useAuth();

  useEffect(() => {
    if (!url) return;

    const parsed = Linking.parse(url);
    const parts = [parsed.hostname, ...(parsed.path?.split("/") ?? [])].filter(
      Boolean
    ) as string[];

    // ---- Shared map: .../share/<id> ----
    const shareIdx = parts.indexOf("share");
    if (shareIdx >= 0 && parts[shareIdx + 1]) {
      const state = decodeMapState(parts[shareIdx + 1]);
      const ids = state?.v ?? [];
      if (ids.length === 0) return;
      const preview = ids
        .slice(0, 3)
        .map((id) => getCountryNameById(id))
        .join(", ");
      Alert.alert(
        "Open shared map",
        `This map has ${ids.length} visited ${ids.length === 1 ? "country" : "countries"}` +
          (preview ? ` (${preview}${ids.length > 3 ? "…" : ""})` : "") +
          ". Add them to your map?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Add",
            onPress: () => {
              useAppStore.getState().markVisitedMany(ids, true);
              if (state?.c) useAppStore.getState().setVisitedCountryColor(state.c);
            },
          },
        ]
      );
      return;
    }

    // ---- Email confirmation: .../auth/confirm?code=... ----
    const authIdx = parts.indexOf("auth");
    if (authIdx >= 0 && supabase) {
      const code = parsed.queryParams?.code;
      const tokenHash = parsed.queryParams?.token_hash;
      (async () => {
        try {
          if (typeof code === "string") {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) throw error;
          } else if (typeof tokenHash === "string") {
            const { error } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: "email",
            });
            if (error) throw error;
          } else {
            return;
          }
          await refresh();
          Alert.alert("Email confirmed", "You're signed in. Your map will sync.");
        } catch (e: any) {
          Alert.alert("Couldn't confirm", e?.message ?? "Please try signing in.");
        }
      })();
    }
  }, [url, refresh]);
}

// Lightweight bottom-tab shell (Map / Countries / Settings) — replaces the web
// app's header nav + MobileBottomNav. Kept dependency-free (no navigation lib /
// no extra native module) since three sibling screens don't need a router.
// The country edit sheet and onboarding live here so they're available from
// every tab.
import React, { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MapScreen } from "../screens/MapScreen";
import { CountriesScreen } from "../screens/CountriesScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { CountryEditSheet } from "../components/CountryEditSheet";
import { Onboarding } from "../components/Onboarding";
import { useAppStore } from "../core/state/store";

type Tab = "map" | "countries" | "settings";

const TABS: Array<{ key: Tab; label: string; icon: string }> = [
  { key: "map", label: "Map", icon: "🗺️" },
  { key: "countries", label: "Countries", icon: "📋" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

export function RootTabs() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("map");

  const locateOnMap = useCallback((id: string) => {
    useAppStore.getState().selectCountry(id);
    setTab("map");
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.screen}>
        {tab === "map" && <MapScreen />}
        {tab === "countries" && <CountriesScreen onLocate={locateOnMap} />}
        {tab === "settings" && <SettingsScreen />}
      </View>

      <View style={[styles.tabBar, { paddingBottom: insets.bottom || 8 }]}>
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <Pressable
              key={t.key}
              style={styles.tabItem}
              onPress={() => setTab(t.key)}
            >
              <Text style={[styles.tabIcon, { opacity: active ? 1 : 0.45 }]}>
                {t.icon}
              </Text>
              <Text
                style={[
                  styles.tabLabel,
                  { color: active ? "#111827" : "#9CA3AF" },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Global overlays (work from any tab) */}
      <CountryEditSheet />
      <Onboarding />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  screen: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
    paddingTop: 8,
  },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  tabIcon: { fontSize: 22 },
  tabLabel: { fontSize: 11, fontWeight: "600" },
});

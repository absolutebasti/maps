// Settings tab — visited-color picker + fill-pattern picker (ported from the web
// Legend's customization section), plus data controls. Theme toggle is added in
// the theming batch.
import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAppStore } from "../core/state/store";
import type { FillPattern, Settings } from "../core/state/store";
import { ONBOARDING_KEY } from "../components/Onboarding";
import { useTheme } from "../theme/useTheme";
import { fonts } from "../theme/tokens";
import { useAuth } from "../auth/AuthProvider";
import { AuthSheet } from "../auth/AuthSheet";
import { signOut } from "../core/supabase/auth";

const SYNC_LABEL: Record<string, string> = {
  idle: "",
  syncing: "Syncing…",
  synced: "Synced ✓",
  error: "Sync error",
};

const THEME_OPTIONS: Array<{ key: Settings["theme"]; label: string }> = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "system", label: "System" },
];

// Exact 15-color palette from the web Legend.
const COLOR_PALETTE = [
  "#F87171", "#FB923C", "#FBBF24", "#A3E635", "#34D399",
  "#22D3EE", "#38BDF8", "#818CF8", "#A78BFA", "#F472B6",
  "#E8DCC4", "#FFD1DC", "#ADD8E6", "#98FF98", "#E6E6FA",
];

const FILL_PATTERNS: Array<{ id: FillPattern; name: string; icon: string }> = [
  { id: "filled", name: "Solid", icon: "▮" },
  { id: "lines", name: "Lines", icon: "╱" },
  { id: "dots", name: "Dots", icon: "•" },
  { id: "crosshatch", name: "Cross", icon: "╳" },
];

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { c, pref } = useTheme();
  const visitedColor = useAppStore((s) => s.settings.visitedCountryColor);
  const setVisitedColor = useAppStore((s) => s.setVisitedCountryColor);
  const fillPattern = useAppStore((s) => s.settings.fillPattern);
  const setFillPattern = useAppStore((s) => s.setFillPattern);
  const setTheme = useAppStore((s) => s.setTheme);
  const clearAllData = useAppStore((s) => s.clearAllData);
  const { user, syncStatus, configured, refresh } = useAuth();
  const [authVisible, setAuthVisible] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    await refresh();
  };

  const confirmClear = () => {
    Alert.alert(
      "Clear all data?",
      "This removes every visited country, note, rating and tag. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: () => clearAllData() },
      ]
    );
  };

  const replayOnboarding = async () => {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    Alert.alert("Onboarding reset", "The intro will show next time you open the app.");
  };

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: c.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 8, paddingBottom: 32 },
      ]}
    >
      <Text style={[styles.title, { color: c.text, fontFamily: fonts.bold }]}>Settings</Text>

      {/* Account / cloud sync */}
      {configured && (
        <>
          <Text style={[styles.section, { color: c.subtext }]}>Account</Text>
          {user ? (
            <View>
              <View style={styles.accountRow}>
                <Text style={[styles.accountEmail, { color: c.text }]} numberOfLines={1}>
                  {user.email}
                </Text>
                {!!SYNC_LABEL[syncStatus] && (
                  <Text style={[styles.syncStatus, { color: c.subtext }]}>
                    {SYNC_LABEL[syncStatus]}
                  </Text>
                )}
              </View>
              <Pressable style={[styles.rowBtn, { backgroundColor: c.muted }]} onPress={handleSignOut}>
                <Text style={[styles.rowBtnText, { color: c.text }]}>Sign out</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={[styles.rowBtn, { backgroundColor: c.primary }]}
              onPress={() => setAuthVisible(true)}
            >
              <Text style={[styles.rowBtnText, { color: c.primaryText }]}>
                Sign in / Sign up
              </Text>
            </Pressable>
          )}
        </>
      )}

      {/* Appearance */}
      <Text style={[styles.section, { color: c.subtext }]}>Appearance</Text>
      <View style={styles.patternRow}>
        {THEME_OPTIONS.map((opt) => {
          const active = pref === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => setTheme(opt.key)}
              style={[
                styles.patternBtn,
                { borderColor: active ? c.primary : c.border, backgroundColor: active ? c.muted : "transparent" },
              ]}
            >
              <Text style={[styles.patternName, { color: active ? c.text : c.subtext }]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Visited color */}
      <Text style={[styles.section, { color: c.subtext }]}>Visited color</Text>
      <View style={styles.swatchGrid}>
        {COLOR_PALETTE.map((color) => {
          const active = visitedColor === color;
          return (
            <Pressable
              key={color}
              onPress={() => setVisitedColor(color)}
              style={[
                styles.swatch,
                { backgroundColor: color, borderColor: active ? c.text : "transparent" },
              ]}
            />
          );
        })}
      </View>

      {/* Fill style */}
      <Text style={[styles.section, { color: c.subtext }]}>Fill style</Text>
      <View style={styles.patternRow}>
        {FILL_PATTERNS.map((p) => {
          const active = fillPattern === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => setFillPattern(p.id)}
              style={[
                styles.patternBtn,
                { borderColor: active ? c.primary : c.border, backgroundColor: active ? c.muted : "transparent" },
              ]}
            >
              <Text style={[styles.patternIcon, { color: c.text }]}>{p.icon}</Text>
              <Text style={[styles.patternName, { color: active ? c.text : c.subtext }]}>
                {p.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Legend key */}
      <Text style={[styles.section, { color: c.subtext }]}>Legend</Text>
      <View style={styles.legendRow}>
        <View style={[styles.legendSwatch, { backgroundColor: visitedColor }]} />
        <Text style={[styles.legendText, { color: c.text }]}>Visited</Text>
      </View>
      <View style={styles.legendRow}>
        <View style={[styles.legendSwatch, { backgroundColor: "#E5E7EB" }]} />
        <Text style={[styles.legendText, { color: c.text }]}>Not visited</Text>
      </View>

      {/* Data */}
      <Text style={[styles.section, { color: c.subtext }]}>Data</Text>
      <Pressable style={[styles.rowBtn, { backgroundColor: c.muted }]} onPress={replayOnboarding}>
        <Text style={[styles.rowBtnText, { color: c.text }]}>Replay intro</Text>
      </Pressable>
      <Pressable style={[styles.rowBtn, { backgroundColor: c.dangerBg }]} onPress={confirmClear}>
        <Text style={[styles.rowBtnText, { color: c.danger }]}>Clear all data</Text>
      </Pressable>

      <Text style={[styles.version, { color: c.subtext }]}>MyMap · v1.0.0</Text>

      <AuthSheet
        visible={authVisible}
        onClose={() => setAuthVisible(false)}
        onSuccess={refresh}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  content: { paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 8 },
  section: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 10,
  },
  swatchGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchActive: { borderColor: "#111827" },
  patternRow: { flexDirection: "row", gap: 8 },
  patternBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
    gap: 4,
  },
  patternBtnActive: { borderColor: "#111827", backgroundColor: "#F9FAFB" },
  patternIcon: { fontSize: 20 },
  patternName: { fontSize: 11, color: "#6B7280", fontWeight: "600" },
  patternNameActive: { color: "#111827" },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  legendSwatch: { width: 16, height: 16, borderRadius: 4 },
  legendText: { fontSize: 14, color: "#374151" },
  rowBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    marginBottom: 10,
  },
  rowBtnText: { fontSize: 15, fontWeight: "600", color: "#111827" },
  dangerBtn: { backgroundColor: "#FEF2F2" },
  dangerText: { color: "#DC2626" },
  version: { textAlign: "center", color: "#9CA3AF", fontSize: 12, marginTop: 24 },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  accountEmail: { fontSize: 15, fontWeight: "600", flex: 1 },
  syncStatus: { fontSize: 12, marginLeft: 8 },
});


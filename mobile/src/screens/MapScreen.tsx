// The main map screen: the world map plus the on-map overlays ported from the
// web (title header, visited-% stats box, +/- zoom buttons, tap tooltip).
import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActionSheetIOS,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";

import { WorldMap } from "../map/WorldMap";
import { MapTooltip, type TooltipData } from "../map/MapTooltip";
import { colors } from "../theme/colors";
import { useTheme } from "../theme/useTheme";
import { fonts } from "../theme/tokens";
import { useAppStore } from "../core/state/store";
import { shareLink, saveImageToPhotos, shareImage } from "../share/shareExport";

export function MapScreen() {
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [stats, setStats] = useState({ visited: 0, total: 195, pct: 0 });
  const mapApi = useRef<{ zoomBy: (d: number) => void } | null>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shotRef = useRef<any>(null);

  const openShareMenu = useCallback(() => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: "Share your map",
        options: ["Share link", "Save image to Photos", "Share image", "Cancel"],
        cancelButtonIndex: 3,
      },
      (i) => {
        if (i === 0) void shareLink(useAppStore.getState().countriesById);
        else if (i === 1) void saveImageToPhotos(shotRef);
        else if (i === 2) void shareImage(shotRef);
      }
    );
  }, []);

  const handleShowTooltip = useCallback((data: TooltipData) => {
    setTooltip(data);
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => setTooltip(null), 2500);
  }, []);

  const handleStatsChange = useCallback(
    (visited: number, total: number, pct: number) => {
      setStats({ visited, total, pct });
    },
    []
  );

  const handleReady = useCallback(
    (api: { zoomBy: (d: number) => void }) => {
      mapApi.current = api;
    },
    []
  );

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 8, backgroundColor: c.card, borderBottomColor: c.border },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: c.text, fontFamily: fonts.bold }]}>
              My Visited Countries
            </Text>
            <Text style={[styles.subtitle, { color: c.subtext }]}>
              Tap a country to mark it · long-press to edit
            </Text>
          </View>
          <Pressable
            style={[styles.shareBtn, { backgroundColor: c.primary }]}
            onPress={openShareMenu}
            hitSlop={8}
          >
            <Text style={[styles.shareBtnText, { color: c.primaryText }]}>Share</Text>
          </Pressable>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapArea}>
        <ViewShot ref={shotRef} style={styles.shot}>
          <WorldMap
            onShowTooltip={handleShowTooltip}
            onStatsChange={handleStatsChange}
            onReady={handleReady}
          />
        </ViewShot>

        {/* Stats box (top-right) */}
        <View style={styles.statsBox}>
          <Text style={styles.statsPct}>{stats.pct}%</Text>
          <Text style={styles.statsCount}>
            {stats.visited} / {stats.total}
          </Text>
        </View>

        {/* Zoom controls (bottom-right; tab bar owns the safe-area inset) */}
        <View style={[styles.zoomControls, { bottom: 16 }]}>
          <Pressable
            style={styles.zoomButton}
            onPress={() => mapApi.current?.zoomBy(0.5)}
            hitSlop={8}
          >
            <Text style={styles.zoomLabel}>＋</Text>
          </Pressable>
          <Pressable
            style={styles.zoomButton}
            onPress={() => mapApi.current?.zoomBy(-0.5)}
            hitSlop={8}
          >
            <Text style={styles.zoomLabel}>－</Text>
          </Pressable>
        </View>
      </View>

      {/* Tooltip overlay (screen-space, non-interactive) */}
      {tooltip && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <MapTooltip data={tooltip} screenWidth={screenWidth} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#ffffff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: "700", letterSpacing: 0.5 },
  subtitle: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  shareBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  shareBtnText: { fontSize: 14, fontWeight: "700" },
  mapArea: { flex: 1, padding: 8 },
  shot: { flex: 1 },
  statsBox: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: colors.statsBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  statsPct: { color: colors.statsText, fontSize: 26, fontWeight: "800" },
  statsCount: { color: colors.statsSubText, fontSize: 11 },
  zoomControls: {
    position: "absolute",
    right: 16,
    gap: 10,
  },
  zoomButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.buttonBg,
    borderWidth: 1,
    borderColor: colors.buttonBorder,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  zoomLabel: { fontSize: 24, color: colors.buttonText, lineHeight: 28 },
});

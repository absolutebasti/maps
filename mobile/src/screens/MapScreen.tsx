// The main map screen: the world map plus the on-map overlays ported from the
// web (title header, visited-% stats box, +/- zoom buttons, tap tooltip).
import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { WorldMap } from "../map/WorldMap";
import { MapTooltip, type TooltipData } from "../map/MapTooltip";
import { colors } from "../theme/colors";

export function MapScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [stats, setStats] = useState({ visited: 0, total: 195, pct: 0 });
  const mapApi = useRef<{ zoomBy: (d: number) => void } | null>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>My Visited Countries</Text>
      </View>

      {/* Map */}
      <View style={styles.mapArea}>
        <WorldMap
          onShowTooltip={handleShowTooltip}
          onStatsChange={handleStatsChange}
          onReady={handleReady}
        />

        {/* Stats box (top-right) */}
        <View style={styles.statsBox}>
          <Text style={styles.statsPct}>{stats.pct}%</Text>
          <Text style={styles.statsCount}>
            {stats.visited} / {stats.total}
          </Text>
        </View>

        {/* Zoom controls (bottom-right) */}
        <View style={[styles.zoomControls, { bottom: insets.bottom + 16 }]}>
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
  title: { fontSize: 20, fontWeight: "700", letterSpacing: 0.5 },
  mapArea: { flex: 1, padding: 8 },
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

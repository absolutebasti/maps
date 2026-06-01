// The interactive native world map.
//
// Faithful port of the web MapView's behavior:
//   - geoEqualEarth projection (via projection.ts) drawing country paths
//   - tap a country to toggle visited (web: onClick -> toggleVisited)
//   - pinch to zoom (web: wheel), drag to pan (web: ZoomableGroup), clamped 1-4x
//   - tap reveals a tooltip (web: hover), auto-dismissed
//   - "zoom to country" when a country is selected elsewhere (e.g. search)
//
// Pan/zoom is a screen-space affine transform on an SVG <G>. The heavy country
// path layer is memoized, so only the <G> transform + a handful of overlay text
// nodes update per gesture frame.
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, StyleSheet } from "react-native";
import type { GestureResponderEvent } from "react-native";
import Svg, { G, Rect, Defs, Pattern, Line } from "react-native-svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { buildGeography } from "./projection";
import { CountryPaths } from "./CountryPaths";
import { FillPatterns } from "./FillPatterns";
import { MapOverlays } from "./MapOverlays";
import type { TooltipData } from "./MapTooltip";
import { useAppStore } from "../core/state/store";
import { getCountryNameById, getWorldCountryList } from "../core/map";
import { colors } from "../theme/colors";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

type Transform = { scale: number; tx: number; ty: number };

type Props = {
  onShowTooltip?: (data: TooltipData) => void;
  onStatsChange?: (visited: number, total: number, pct: number) => void;
  /** Exposes a zoomBy fn to parent controls (the +/- buttons). */
  onReady?: (api: { zoomBy: (delta: number) => void }) => void;
};

function clampScale(s: number) {
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));
}

// Keep the W x H content box covering the viewport (no empty gaps). At scale 1
// this forces the identity transform — the whole world, centered.
function clampTransform(t: Transform, w: number, h: number): Transform {
  const scale = clampScale(t.scale);
  const minTx = w * (1 - scale);
  const minTy = h * (1 - scale);
  return {
    scale,
    tx: Math.max(minTx, Math.min(0, t.tx)),
    ty: Math.max(minTy, Math.min(0, t.ty)),
  };
}

export function WorldMap({ onShowTooltip, onStatsChange, onReady }: Props) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [t, setT] = useState<Transform>({ scale: 1, tx: 0, ty: 0 });
  const tRef = useRef(t);

  const countriesById = useAppStore((s) => s.countriesById);
  const visitedColor = useAppStore((s) => s.settings.visitedCountryColor);
  const fillPattern = useAppStore((s) => s.settings.fillPattern);
  const selectedId = useAppStore((s) => s.selectedCountryId);

  const geography = useMemo(
    () => (size.w > 0 && size.h > 0 ? buildGeography(size.w, size.h) : null),
    [size.w, size.h]
  );

  const commit = useCallback((next: Transform) => {
    tRef.current = next;
    setT(next);
  }, []);

  // Persist zoom + geographic center back to the store (for share/export and
  // the zoom-to-country effect), mirroring the web onMoveEnd.
  const syncStore = useCallback(() => {
    if (!geography) return;
    const { scale, tx, ty } = tRef.current;
    const cx = (size.w / 2 - tx) / scale;
    const cy = (size.h / 2 - ty) / scale;
    const center = geography.projection.invert?.([cx, cy]);
    useAppStore.getState().setMapView({
      zoom: scale,
      ...(center && !isNaN(center[0]) && !isNaN(center[1])
        ? { center: [center[0], center[1]] as [number, number] }
        : {}),
    });
  }, [geography, size.w, size.h]);

  // ---- Gestures (run on JS thread to keep state handling simple) ----
  const panStart = useRef({ tx: 0, ty: 0 });
  const pinchStart = useRef({ scale: 1, tx: 0, ty: 0, fx: 0, fy: 0 });

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .minDistance(6)
        .averageTouches(true)
        .onBegin(() => {
          panStart.current = { tx: tRef.current.tx, ty: tRef.current.ty };
        })
        .onUpdate((e) => {
          commit(
            clampTransform(
              {
                scale: tRef.current.scale,
                tx: panStart.current.tx + e.translationX,
                ty: panStart.current.ty + e.translationY,
              },
              size.w,
              size.h
            )
          );
        })
        .onEnd(syncStore),
    [commit, syncStore, size.w, size.h]
  );

  const pinch = useMemo(
    () =>
      Gesture.Pinch()
        .runOnJS(true)
        .onBegin((e) => {
          pinchStart.current = {
            scale: tRef.current.scale,
            tx: tRef.current.tx,
            ty: tRef.current.ty,
            fx: e.focalX,
            fy: e.focalY,
          };
        })
        .onUpdate((e) => {
          const { scale: s0, tx, ty, fx, fy } = pinchStart.current;
          const s1 = clampScale(s0 * e.scale);
          // Keep the focal point fixed on screen while scaling.
          const cx = (fx - tx) / s0;
          const cy = (fy - ty) / s0;
          commit(
            clampTransform(
              { scale: s1, tx: fx - s1 * cx, ty: fy - s1 * cy },
              size.w,
              size.h
            )
          );
        })
        .onEnd(syncStore),
    [commit, syncStore, size.w, size.h]
  );

  const gesture = useMemo(
    () => Gesture.Simultaneous(pan, pinch),
    [pan, pinch]
  );

  // Zoom around the viewport center (the +/- buttons).
  const zoomBy = useCallback(
    (delta: number) => {
      const { scale: s0, tx, ty } = tRef.current;
      const s1 = clampScale(s0 + delta);
      const fx = size.w / 2;
      const fy = size.h / 2;
      const cx = (fx - tx) / s0;
      const cy = (fy - ty) / s0;
      commit(
        clampTransform(
          { scale: s1, tx: fx - s1 * cx, ty: fy - s1 * cy },
          size.w,
          size.h
        )
      );
      syncStore();
    },
    [commit, syncStore, size.w, size.h]
  );

  useEffect(() => {
    onReady?.({ zoomBy });
  }, [onReady, zoomBy]);

  // Zoom-to-country when something selects a country (e.g. search). Mirrors the
  // web useEffect that set zoom 2.5 and centered on the country centroid.
  useEffect(() => {
    if (!selectedId || !geography) return;
    const country = geography.countries.find((c) => c.id === selectedId);
    if (!country) return;
    const p = geography.projection(country.centroid);
    if (!p) return;
    const s1 = 2.5;
    commit(
      clampTransform(
        { scale: s1, tx: size.w / 2 - s1 * p[0], ty: size.h / 2 - s1 * p[1] },
        size.w,
        size.h
      )
    );
    syncStore();
  }, [selectedId, geography, size.w, size.h, commit, syncStore]);

  // Stats (visited / total / percent), mirroring the web stats box.
  useEffect(() => {
    if (!onStatsChange) return;
    const total = getWorldCountryList().length;
    const visited = Object.values(countriesById).filter((c) => c.visited)
      .length;
    const pct = total > 0 ? Math.round((visited / total) * 100) : 0;
    onStatsChange(visited, total, pct);
  }, [countriesById, onStatsChange]);

  const handleCountryPress = useCallback(
    (id: string, e: GestureResponderEvent) => {
      useAppStore.getState().toggleVisited(id);
      const data = useAppStore.getState().countriesById[id];
      const ne = e.nativeEvent;
      onShowTooltip?.({
        x: ne.pageX,
        y: ne.pageY,
        countryName: getCountryNameById(id),
        visited: Boolean(data?.visited),
        notes: data?.note,
        rating: data?.rating,
      });
    },
    [onShowTooltip]
  );

  const handleCountryLongPress = useCallback((id: string) => {
    useAppStore.getState().openEditDialog(id);
  }, []);

  const onLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number; height: number } } }) => {
      const { width, height } = e.nativeEvent.layout;
      setSize({ w: width, h: height });
    },
    []
  );

  return (
    <View style={styles.container} onLayout={onLayout}>
      {/* Static ocean background with a faint diagonal "wave" texture. */}
      {size.w > 0 && (
        <Svg
          style={StyleSheet.absoluteFill}
          width={size.w}
          height={size.h}
          pointerEvents="none"
        >
          <Defs>
            <Pattern
              id="ocean-waves"
              patternUnits="userSpaceOnUse"
              width={82}
              height={82}
              patternTransform="rotate(45)"
            >
              <Rect width={82} height={82} fill={colors.ocean} />
              <Line
                x1={0}
                y1={0}
                x2={0}
                y2={82}
                stroke="white"
                strokeWidth={2}
                opacity={0.12}
              />
            </Pattern>
          </Defs>
          <Rect width={size.w} height={size.h} fill="url(#ocean-waves)" />
        </Svg>
      )}

      <GestureDetector gesture={gesture}>
        <View style={StyleSheet.absoluteFill}>
          {geography && (
            <Svg width={size.w} height={size.h}>
              <FillPatterns color={visitedColor} />
              <G transform={`translate(${t.tx}, ${t.ty}) scale(${t.scale})`}>
                <CountryPaths
                  countries={geography.countries}
                  countriesById={countriesById}
                  visitedColor={visitedColor}
                  fillPattern={fillPattern}
                  selectedId={selectedId}
                  onPressCountry={handleCountryPress}
                  onLongPressCountry={handleCountryLongPress}
                />
                <MapOverlays
                  projection={geography.projection}
                  countries={geography.countries}
                  countriesById={countriesById}
                  scale={t.scale}
                />
              </G>
            </Svg>
          )}
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: colors.ocean,
  },
});

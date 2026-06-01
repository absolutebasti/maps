# MyMap — Native iOS app (Expo + React Native)

A native port of the web "Visited Countries" map (the Next.js app in the repo
root). Built with **Expo (prebuild / Continuous Native Generation)** so it
compiles and ships through **Xcode** like any native app, while reusing React
Native + the Expo toolchain.

This folder is a faithful re-implementation of the **core map experience**. The
marketing site, blog, SEO, and Next.js API routes are intentionally **not**
ported — the existing web app keeps serving those.

## What's in this first cut

A running, interactive world map:

- **Pure-JS core, ported verbatim** from the web app — same data model, so web
  and native stay in sync:
  - `src/core/state/store.ts` — the entire Zustand store (countries, tags,
    settings, map view, all actions). Byte-identical to the web store.
  - `src/core/map/` — `d3-geo` + `topojson-client` pipeline and the
    `world-topo.json` / country reference data (pure math, runs unchanged).
  - `src/core/share/encode.ts` — share-link base64url encode/decode (browser
    `btoa`/`atob` swapped for a self-contained UTF-8 base64 implementation).
  - `src/core/supabase/auth.ts`, `sync.ts` — auth + cloud-sync/merge logic
    (unchanged; the client is RN-adapted, see below).
- **Native map renderer** (`src/map/`) — rebuilt because React Native has no
  DOM/SVG-in-browser:
  - `projection.ts` — `geoEqualEarth` fit to the device viewport, producing SVG
    path strings via `geoPath`.
  - `WorldMap.tsx` — `react-native-svg` country paths + `react-native-gesture-handler`
    pinch-to-zoom / drag-to-pan / tap-to-toggle, clamped 1–4× like the web map.
  - `FillPatterns.tsx` — the lines / dots / crosshatch visited fills (ported
    from the web `<defs>`).
  - `MapOverlays.tsx` — ocean labels + per-country emoji tag badges.
  - `MapTooltip.tsx` — tap-to-reveal tooltip (replaces hover).
- **Local persistence** (`src/persist/`) — `AsyncStorage` replacing
  `localStorage`, same versioned `mymap.v1` blob; hydrate-on-launch + debounced
  save-on-change.
- **App shell** — `App.tsx` (gesture + safe-area providers, hydration gate) and
  `src/screens/MapScreen.tsx` (header, visited-% stats box, +/- zoom buttons).

## Run it in Xcode

```bash
cd mobile

# 1. Generate the native iOS project (ios/) and install pods.
npx expo prebuild -p ios

# 2a. Open in Xcode and press Run:
open ios/MyMap.xcworkspace
#     (select a Simulator or your device, set a Signing Team for device builds)

# 2b. …or build + launch on a Simulator straight from the CLI:
npx expo run:ios
```

Simulator builds need no Apple signing. For a physical device or the App Store,
set your Team / bundle id (`de.fackelmann.mymap`) in Xcode → Signing &
Capabilities, or use EAS Build.

## Supabase (optional — app runs fully offline without it)

Auth + cloud sync activate only when these env vars are present (Expo inlines
`EXPO_PUBLIC_*` at build time). Create `mobile/.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

The same Supabase project / schema as the web app is reused unchanged.

## Not yet built (next phases)

Tracked against the full migration plan — roughly in priority order:

1. Country detail / edit sheet (notes, date, rating, tags) — `@gorhom/bottom-sheet`.
2. Legend (color + pattern picker) and country search (cmdk replacement).
3. Bulk country-management screen + bottom-tab navigation.
4. Light/dark theming (NativeWind + `useColorScheme`), Lemon Milk fonts.
5. Auth UI + cloud sync wiring + share/export (view-shot → Photos / Share sheet)
   + deep links (`mymap://share/<id>`, `mymap://auth/confirm`).
6. App Store hardening: privacy manifest, icons/splash, donation/IAP review.

## Performance note

Pan/zoom currently drives the SVG `<G>` transform from JS (correct + crisp at
all zoom levels; the heavy ~195-path layer is memoized so only the transform
updates per frame). If pinch feels heavy on older devices, the planned
optimization is `@shopify/react-native-skia` + Reanimated shared values on the
UI thread.

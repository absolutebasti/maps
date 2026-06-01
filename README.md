# MyMap

A "countries I've visited" travel map. **The product is now a native iOS app.**

## Repo layout

```
mobile/        ← THE APP. Native iOS app (Expo + React Native), shipped via Xcode/TestFlight.
legacy-web/    ← Archived original Next.js web app. Not used anymore; kept for reference.
```

Everything active lives in **[mobile/](mobile/)**. Start there:

- [mobile/README.md](mobile/README.md) — architecture, how to run it in Xcode
- [mobile/TESTFLIGHT.md](mobile/TESTFLIGHT.md) — how to ship to TestFlight / the App Store

## Quick start (the iOS app)

```bash
cd mobile
npm install
npx expo prebuild -p ios     # generates the native ios/ Xcode project
open ios/MyMap.xcworkspace    # ▶ Run on a simulator or device
```

The native app reuses the original app's pure-JS core (state store, the
d3-geo/topojson map pipeline, share encoding, and Supabase sync logic) verbatim
under `mobile/src/core/`, and rebuilds the UI/rendering natively. The shared
Supabase backend setup + schema lives in [mobile/docs/](mobile/docs/).

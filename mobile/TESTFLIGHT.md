# Shipping MyMap to TestFlight

Two ways to get a build into TestFlight. Both end in App Store Connect →
TestFlight. Pick one.

## Prerequisites (both paths — these need YOUR Apple account)

1. **Apple Developer Program membership** ($99/yr) — required for TestFlight.
   https://developer.apple.com/programs/
2. **App record in App Store Connect** with bundle id **`de.fackelmann.mymap`**:
   App Store Connect → Apps → ➕ → New App → platform iOS, pick/register that
   bundle id, give it a name (e.g. "MyMap"). (Xcode and EAS can also create the
   App ID for you on first upload.)
3. A signing **Team** — your membership provides one; you select it in Xcode, or
   let EAS manage credentials.

Nothing in the codebase can do these for you — they're tied to your Apple ID.

---

## Path A — Xcode (what you asked for)

```bash
cd mobile

# Regenerate the native iOS project from app.json (ios/ is gitignored).
npx expo prebuild -p ios --clean

# Open the workspace (NOT the .xcodeproj) in Xcode.
open ios/MyMap.xcworkspace
```

In Xcode:

1. Select the **MyMap** target → **Signing & Capabilities**.
   - Check **Automatically manage signing**.
   - Choose your **Team** (sign in with your Apple ID if prompted).
2. Set the run destination to **Any iOS Device (arm64)** (top bar) — not a
   simulator. Archives require a device target.
3. **Product → Archive**. Wait for the build.
4. In the **Organizer** window that opens: select the archive →
   **Distribute App → App Store Connect → Upload** → keep defaults → Upload.
5. Wait a few minutes; the build appears in **App Store Connect → your app →
   TestFlight**. Add yourself as an internal tester and install via the
   TestFlight app on your iPhone.

To ship an update later: bump `ios.buildNumber` in `app.json` (e.g. "2"),
`npx expo prebuild -p ios --clean`, Archive, Upload again.

---

## Path B — EAS (one command, builds + uploads in the cloud)

Easiest for an Expo app; still produces a real signed build.

```bash
cd mobile
npm i -g eas-cli
eas login                       # your Expo account (free)
eas build:configure            # links the project (writes extra.eas.projectId)

# Build a signed iOS release (EAS will prompt for your Apple credentials and
# create the signing cert + provisioning profile for you):
eas build -p ios --profile production

# Then upload that build straight to TestFlight:
eas submit -p ios --latest
```

`eas.json` is already in this folder with `development` / `preview` /
`production` profiles. `preview` builds a Simulator build; `production` builds
the signed archive for TestFlight/App Store.

---

## Notes

- Export-compliance: `app.json` sets `ios.config.usesNonExemptEncryption: false`,
  so TestFlight won't ask the encryption question on every build.
- App icon + splash: a branded globe icon and splash are configured. You can
  swap your own art into `assets/icon.png` (1024×1024) and `assets/splash-icon.png`.
- Privacy: an iOS Privacy Manifest (`app.json` → `ios.privacyManifests`) declares
  the required-reason APIs. Still answer the App Privacy questions in App Store
  Connect (email is collected for the optional account/sync; no tracking).

## Troubleshooting

- **Build error `Build input file cannot be found: …/Supporting/Expo.plist`** —
  a stale `ios/` from repeated local builds. Regenerate it clean:
  ```bash
  rm -rf ios && npx expo prebuild -p ios --clean
  ```
  (A fresh checkout — where `ios/` doesn't exist yet — never hits this.)

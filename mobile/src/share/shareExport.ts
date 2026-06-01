// Share + image export — native equivalents of the web ShareExportMenu.
//   - Share link: builds the same encoded share URL and opens the iOS Share sheet
//     (replaces the web Copy Link / navigator.share).
//   - Save / Share image: captures the rendered map view (replaces the web
//     SVG -> canvas -> download), then saves to Photos or opens the Share sheet.
import { Share, Alert } from "react-native";
import type { RefObject } from "react";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

import type { CountryData } from "../core/state/store";
import { createShareableState, generateShareUrl } from "../core/share/encode";

// Existing web deployment that serves the /share/<id> view-only page. Share
// links keep working as long as it stays up (and can later open the app via
// Universal Links).
const WEB_BASE_URL = "https://maps-production-d32c.up.railway.app";

export async function shareLink(
  countriesById: Record<string, CountryData>
): Promise<void> {
  const visited = Object.values(countriesById).filter((c) => c.visited).length;
  if (visited === 0) {
    Alert.alert("Nothing to share yet", "Mark some countries as visited first!");
    return;
  }
  const state = createShareableState(countriesById);
  const url = generateShareUrl(WEB_BASE_URL, state, "ios");
  try {
    await Share.share({
      message: `I've visited ${visited} countries! Check out my travel map 🗺️ ${url}`,
      url,
    });
  } catch {
    // user cancelled — ignore
  }
}

async function captureMap(ref: RefObject<any>): Promise<string | null> {
  try {
    return await captureRef(ref, { format: "png", quality: 1 });
  } catch {
    return null;
  }
}

export async function saveImageToPhotos(ref: RefObject<any>): Promise<void> {
  const uri = await captureMap(ref);
  if (!uri) {
    Alert.alert("Export failed", "Couldn't capture the map. Please try again.");
    return;
  }
  const perm = await MediaLibrary.requestPermissionsAsync();
  if (!perm.granted) {
    Alert.alert("Permission needed", "Allow Photos access to save your map image.");
    return;
  }
  try {
    await MediaLibrary.saveToLibraryAsync(uri);
    Alert.alert("Saved! 🎉", "Your travel map is in Photos.");
  } catch {
    Alert.alert("Save failed", "Couldn't save the image.");
  }
}

export async function shareImage(ref: RefObject<any>): Promise<void> {
  const uri = await captureMap(ref);
  if (!uri) {
    Alert.alert("Export failed", "Couldn't capture the map. Please try again.");
    return;
  }
  if (!(await Sharing.isAvailableAsync())) {
    Alert.alert("Sharing unavailable", "Image sharing isn't available on this device.");
    return;
  }
  await Sharing.shareAsync(uri, {
    mimeType: "image/png",
    dialogTitle: "Share your travel map",
  });
}

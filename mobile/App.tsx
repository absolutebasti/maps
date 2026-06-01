import "react-native-gesture-handler";
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { MapScreen } from "./src/screens/MapScreen";
import { usePersistence } from "./src/persist/usePersistence";

export default function App() {
  const { hydrated } = usePersistence();

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        {hydrated ? (
          <MapScreen />
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading your map…</Text>
          </View>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    gap: 12,
  },
  loadingText: { color: "#6B7280", fontSize: 14 },
});

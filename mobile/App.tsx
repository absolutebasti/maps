import "react-native-gesture-handler";
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

import { RootTabs } from "./src/navigation/RootTabs";
import { usePersistence } from "./src/persist/usePersistence";
import { useTheme } from "./src/theme/useTheme";

export default function App() {
  const { hydrated } = usePersistence();
  const { scheme, c } = useTheme();
  const [fontsLoaded] = useFonts({
    "LemonMilk-Regular": require("./assets/fonts/LemonMilk-Regular.otf"),
    "LemonMilk-Medium": require("./assets/fonts/LemonMilk-Medium.otf"),
    "LemonMilk-Bold": require("./assets/fonts/LemonMilk-Bold.otf"),
  });

  const ready = hydrated && fontsLoaded;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        {ready ? (
          <RootTabs />
        ) : (
          <View style={[styles.loading, { backgroundColor: c.bg }]}>
            <ActivityIndicator size="large" color={c.text} />
            <Text style={[styles.loadingText, { color: c.subtext }]}>
              Loading your map…
            </Text>
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
    gap: 12,
  },
  loadingText: { fontSize: 14 },
});

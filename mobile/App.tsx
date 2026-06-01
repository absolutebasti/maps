import "react-native-gesture-handler";
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
// Import only the 3 weights we use, from their subpaths — importing from the
// package index would bundle every Montserrat weight (~6MB of fonts).
import { Montserrat_400Regular } from "@expo-google-fonts/montserrat/400Regular";
import { Montserrat_500Medium } from "@expo-google-fonts/montserrat/500Medium";
import { Montserrat_700Bold } from "@expo-google-fonts/montserrat/700Bold";

import { RootTabs } from "./src/navigation/RootTabs";
import { AuthProvider } from "./src/auth/AuthProvider";
import { usePersistence } from "./src/persist/usePersistence";
import { useTheme } from "./src/theme/useTheme";

export default function App() {
  const { hydrated } = usePersistence();
  const { scheme, c } = useTheme();
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  const ready = hydrated && fontsLoaded;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        {ready ? (
          <AuthProvider>
            <RootTabs />
          </AuthProvider>
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

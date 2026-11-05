import "react-native-gesture-handler";
import "../global.css";

import { glassGlow } from "@venuza/design-tokens";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: glassGlow.main },
        }}
      />
    </SafeAreaProvider>
  );
}

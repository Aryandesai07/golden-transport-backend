import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false, // global default
        }}
      >
        {/* AUTH / ENTRY */}
        <Stack.Screen name="index" />

        {/* MAIN APP */}
        <Stack.Screen name="dashboard" />

        {/* DRIVER SCREENS */}
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="location" />
        <Stack.Screen name="fuel-bill" />
        <Stack.Screen name="delivery-proof" />
        <Stack.Screen name="earnings" />
        <Stack.Screen name="trip-history" />
        <Stack.Screen name="sos" />

        {/* MODAL */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Modal",
          }}
        />
      </Stack>

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

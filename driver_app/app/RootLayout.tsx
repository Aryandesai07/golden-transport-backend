import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>

        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />

        {/* IMPORTANT: add safe routes */}
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="location" />
        <Stack.Screen name="fuel-bill" />
        <Stack.Screen name="delivery-proof" />

      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
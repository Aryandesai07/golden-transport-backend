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
        <Stack.Screen name="location" />
        <Stack.Screen name="fuel-bill" />
        <Stack.Screen name="delivery-proof" />

        {/* MODAL (example if needed later) */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Modal",
          }}
        />
      </Stack>

      {/* StatusBar adapts to theme */}
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

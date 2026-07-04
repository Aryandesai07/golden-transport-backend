import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack screenOptions={{ headerShown: false }}>
        
        {/* STARTUP */}
        <Stack.Screen name="index" />

        {/* AUTH FLOW */}
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="terms" />

        {/* MAIN APP */}
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="location" />
        <Stack.Screen name="fuel-bill" />
        <Stack.Screen name="delivery-proof" />
        <Stack.Screen name="earnings" />
        <Stack.Screen name="trip-history" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="sos" />

        {/* MODAL */}
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal" }}
        />

      </Stack>

      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
      />
    </ThemeProvider>
  );
}
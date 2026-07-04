import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import {
  ThemeProvider,
  useTheme,
} from "../context/ThemeContext";

function RootNavigator() {
  const { darkMode } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="terms" />
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

        
        <Stack.Screen name="settings/profile" />
        <Stack.Screen name="settings/documents" />
        <Stack.Screen name="settings/vehicle" />

        <Stack.Screen name="settings/appearance" />
        <Stack.Screen name="settings/notifications" />
        <Stack.Screen name="settings/live-location" />
        <Stack.Screen name="settings/language" />

        <Stack.Screen name="settings/change-password" />
        <Stack.Screen name="settings/privacy" />

        <Stack.Screen name="settings/updates" />
        <Stack.Screen name="settings/rate-app" />
        <Stack.Screen name="settings/share-app" />
        <Stack.Screen name="settings/contact-support" />

        <Stack.Screen name="settings/privacy-policy" />
        <Stack.Screen name="settings/terms" />
        <Stack.Screen name="settings/about" />

        
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
          }}
          
        />
      </Stack>

      <StatusBar style={darkMode ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
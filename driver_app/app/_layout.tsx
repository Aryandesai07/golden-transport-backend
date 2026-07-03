import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ThemeProvider, useTheme } from "../context/ThemeContext";

function AppNavigator() {
  const { darkMode } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {/* Startup */}
        <Stack.Screen name="index" />

        {/* Authentication */}
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="terms" />

        {/* Main */}
        <Stack.Screen name="dashboard" />

        {/* Driver */}
        <Stack.Screen name="profile" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="location" />
        <Stack.Screen name="fuel-bill" />
        <Stack.Screen name="delivery-proof" />
        <Stack.Screen name="earnings" />
        <Stack.Screen name="trip-history" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="sos" />

        {/* Modal */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>

      <StatusBar
        style={darkMode ? "light" : "dark"}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
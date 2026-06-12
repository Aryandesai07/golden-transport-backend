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
    headerShown: false, // default
  }}
>
  {/* AUTH */}
  <Stack.Screen name="index" />
  <Stack.Screen name="login" />
  <Stack.Screen name="register" />

  {/* MAIN APP */}
  <Stack.Screen name="dashboard" />

  {/* DRIVER SCREENS */}
  <Stack.Screen name="profile" options={{ headerShown: true, title: "Profile" }} />
  <Stack.Screen name="settings" options={{ headerShown: true, title: "Settings" }} />
  <Stack.Screen name="notifications" />
  <Stack.Screen name="location" />
  <Stack.Screen name="fuelBill" />   {/* consistent naming */}
  <Stack.Screen name="deliveryProof" />
  <Stack.Screen name="earnings" />
  <Stack.Screen name="tripHistory" />
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

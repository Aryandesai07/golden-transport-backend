import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Index() {

  // ===============================
  // CHECK SESSION
  // ===============================
  const checkSession = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const driverId = await AsyncStorage.getItem("driver_id");
      const termsAccepted = await AsyncStorage.getItem("termsAccepted");

      console.log("========== APP START ==========");
      console.log("TOKEN :", token);
      console.log("DRIVER:", driverId);
      console.log("TERMS :", termsAccepted);
      console.log("===============================");

      // Terms check first
      if (termsAccepted !== "true") {
        router.replace("/terms");
        return;
      }

      // Auto login check
      if (token?.length && driverId?.length) {
        console.log("AUTO LOGIN SUCCESS");
        router.replace("/dashboard");
        return;
      }

      console.log("OPEN LOGIN");
      router.replace("/login");

    } catch (error) {
      console.log("APP START ERROR:", error);
      router.replace("/login");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🚚</Text>

      <Text style={styles.title}>
        Golden Transport
      </Text>

      <ActivityIndicator
        size="large"
        color="#F59E0B"
      />

      <Text style={styles.text}>
        Loading...
      </Text>
    </View>
  );
}

// ===============================
// STYLES
// ===============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    fontSize: 70,
    marginBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 20,
  },

  text: {
    marginTop: 15,
    fontSize: 16,
    color: "#64748B",
  },
});
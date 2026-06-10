import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startApp();
  }, []);

  const startApp = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const termsAccepted = await AsyncStorage.getItem("termsAccepted");

      // 🔥 FIRST TIME USER → TERMS PAGE
      if (!termsAccepted) {
        router.replace("/terms");
        return;
      }

      // 🔥 LOGGED IN USER → DASHBOARD
      if (token) {
        router.replace("/dashboard");
        return;
      }

      // 🔥 NOT LOGGED IN → LOGIN
      router.replace("/login");

    } catch (error) {
      console.log("APP START ERROR:", error);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🚚</Text>
      <Text style={styles.title}>Golden Transport</Text>

      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={styles.text}>Loading system...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F6FA"
  },
  logo: {
    fontSize: 60,
    marginBottom: 10
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1F2937"
  },
  text: {
    marginTop: 10,
    color: "#6B7280"
  }
});
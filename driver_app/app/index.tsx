import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
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
      const driverId = await AsyncStorage.getItem("driver_id");
      const termsAccepted = await AsyncStorage.getItem("termsAccepted");

      // First-time user
      if (termsAccepted !== "true") {
        router.replace("/terms");
        return;
      }

      // Already logged in
      if (token && driverId) {
        router.replace("/(tabs)/index");
        return;
      }

      // Login
      router.replace("/login");
    } catch (error) {
      console.log("APP START ERROR:", error);

      Alert.alert(
        "Error",
        "Something went wrong. Redirecting to login."
      );

      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          Loading system...
        </Text>
      </View>
    );
  }

  return null;
}

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
    fontSize: 26,
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
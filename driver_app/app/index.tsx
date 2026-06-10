import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
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

      // 1️⃣ FIRST TIME USER → TERMS
      if (!termsAccepted) {
        router.replace("/terms" as any);
        return;
      }

      // 2️⃣ LOGGED IN → DASHBOARD
      if (token) {
        router.replace("/dashboard" as any);
        return;
      }

      // 3️⃣ NOT LOGGED IN → LOGIN
      router.replace("/login" as any);

    } catch (error) {
      console.log("APP START ERROR:", error);
      router.replace("/login" as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff"
    }}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}
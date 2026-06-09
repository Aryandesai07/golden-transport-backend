import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function SplashScreen() {

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true
      })
    ]).start();

    startApp();

  }, [fadeAnim, scaleAnim]);

  const startApp = async () => {

    setTimeout(async () => {

      const accepted =
        await AsyncStorage.getItem("termsAccepted");

      const token =
        await AsyncStorage.getItem("token");

      if (!accepted) {
        router.replace("/terms");
        return;
      }

      if (token) {
        router.replace("/dashboard");
        return;
      }

      router.replace("/login");

    }, 2500);
  };

  return (
    <View style={styles.container}>

      <Animated.View
        style={{
          alignItems: "center",
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}
      >

        <Text style={styles.logo}>
          🚚
        </Text>

        <Text style={styles.company}>
          GOLDEN TAMILNADU
        </Text>

        <Text style={styles.transport}>
          TRANSPORT
        </Text>

        <Text style={styles.tagline}>
          Safe • Fast • Reliable Logistics
        </Text>

      </Animated.View>

      <ActivityIndicator
        size="large"
        color="#F59E0B"
        style={{ marginTop: 50 }}
      />

      <Text style={styles.version}>
        Driver App v1.0
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center"
  },

  logo: {
    fontSize: 90
  },

  company: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
    letterSpacing: 1
  },

  transport: {
    color: "#F59E0B",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 5
  },

  tagline: {
    color: "#CBD5E1",
    fontSize: 14,
    marginTop: 12
  },

  version: {
    color: "#64748B",
    position: "absolute",
    bottom: 40,
    fontSize: 12
  }

});
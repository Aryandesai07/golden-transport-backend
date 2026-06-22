import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Terms() {
  const acceptTerms = async () => {
    await AsyncStorage.setItem("termsAccepted", "true");
    Alert.alert("✅ Success", "You have accepted the terms");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>🚚 Golden Transport</Text>
      <Text style={styles.subtitle}>Driver Terms & Conditions</Text>

      {/* TERMS BOX */}
      <ScrollView style={styles.card}>
        <Text style={styles.text}>
          • Drivers must provide accurate information.{"\n\n"}
          • Earnings will be calculated daily.{"\n\n"}
          • Fake trips will lead to account suspension.{"\n\n"}
          • Drivers must maintain vehicle condition.{"\n\n"}
          • Location tracking may be enabled during trips.{"\n\n"}
          • Company can update policies anytime.
        </Text>
      </ScrollView>

      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={acceptTerms}>
        <Text style={styles.buttonText}>Accept & Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#F3F6FA",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111",
    marginBottom: 5,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
    color: "#555",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    height: 320,
    marginBottom: 25,
    elevation: 4, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    color: "#333",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});

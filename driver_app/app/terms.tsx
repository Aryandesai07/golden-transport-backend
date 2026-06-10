import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Terms() {

  const acceptTerms = async () => {
    await AsyncStorage.setItem("termsAccepted", "true");

    Alert.alert("Success", "Terms Accepted");

    router.replace("/login");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>🚚 Golden Transport</Text>
      <Text style={styles.subtitle}>Terms & Conditions</Text>

      <ScrollView style={styles.box}>
        <Text style={styles.text}>
          1. Driver must follow all transport rules.{'\n\n'}
          2. Earnings will be calculated daily.{'\n\n'}
          3. Fake trips will lead to account suspension.{'\n\n'}
          4. Driver must maintain vehicle condition.{'\n\n'}
          5. Company can update policies anytime.
        </Text>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={acceptTerms}>
        <Text style={styles.buttonText}>Accept & Continue</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FB",
    justifyContent: "center"
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center"
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666"
  },

  box: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    height: 300
  },

  text: {
    fontSize: 14,
    color: "#333"
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    marginTop: 20,
    borderRadius: 10
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  }
});
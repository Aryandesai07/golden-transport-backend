import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function TermsScreen() {

  const acceptTerms = async () => {

    await AsyncStorage.setItem(
      "termsAccepted",
      "true"
    );

    router.replace("/login");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Terms & Conditions
      </Text>

      <ScrollView style={styles.card}>

        <Text style={styles.text}>
          Welcome to Golden Tamilnadu Transport Driver App.

          {"\n\n"}

          • Drivers must provide accurate information.

          {"\n\n"}

          • Location tracking may be enabled during trips.

          {"\n\n"}

          • Any misuse of the platform can result in account suspension.

          {"\n\n"}

          • Transport records must be genuine.

          {"\n\n"}

          • Company reserves the right to update policies.

          {"\n\n"}

          By continuing, you agree to all terms and conditions.
        </Text>

      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={acceptTerms}
      >
        <Text style={styles.buttonText}>
          I Agree & Continue
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 20
  },

  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15
  },

  text: {
    fontSize: 16,
    lineHeight: 25
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 12,
    marginVertical: 20
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  }

});
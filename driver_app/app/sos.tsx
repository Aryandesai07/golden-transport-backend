import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from "react-native";

export default function SOS() {
  const [loading, setLoading] = useState(false);

  const emergencyNumbers = [
    "9284926533",
    "8459824625",
  ];

  const sendSOS = async () => {
    try {
      if (loading) return; // prevent double click

      setLoading(true);

      Alert.alert(
        "🚨 SOS Activated",
        "Calling emergency contacts..."
      );

      for (const number of emergencyNumbers) {
        const url = `tel:${number}`;

        const supported = await Linking.canOpenURL(url);

        if (supported) {
          await Linking.openURL(url);
        } else {
          console.log("Cannot open dialer:", number);
        }
      }
    } catch (error) {
      console.log("SOS Error:", error);

      Alert.alert(
        "Error",
        "Failed to send SOS. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.sosButton,
          loading && { opacity: 0.6 },
        ]}
        onPress={sendSOS}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.sosText}>SOS</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F6FA",
  },

  sosButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  sosText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
});
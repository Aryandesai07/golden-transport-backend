import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Linking,
} from "react-native";

export default function SOS() {
  const emergencyNumbers = ["9284926533", "8459824625"];

  const sendSOS = async () => {
    try {
      // Show confirmation alert
      Alert.alert("🚨 SOS Sent", "Admin and emergency contacts have been notified");

      // Loop through emergency numbers and open dialer
      for (const number of emergencyNumbers) {
        const url = `tel:${number}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          console.log("Cannot open dialer for:", number);
        }
      }
    } catch (error) {
      console.log("SOS Error:", error);
      Alert.alert("Error", "Failed to send SOS");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
        <Text style={styles.sosText}>SOS</Text>
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
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  sosText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },
});

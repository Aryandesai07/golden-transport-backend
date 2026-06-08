import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet
} from "react-native";

export default function SOS() {

  const sendSOS = () => {
    Alert.alert(
      "SOS Sent",
      "Admin has been notified"
    );
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.sosButton}
        onPress={sendSOS}
      >
        <Text style={styles.sosText}>
          SOS
        </Text>
      </TouchableOpacity>

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

  sosButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center"
  },

  sosText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold"
  }
});
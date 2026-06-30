import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function SettingsScreen() {

  const logout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("driver_id");
            await AsyncStorage.removeItem("driver_name");

            router.replace("/login");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>⚙ Settings</Text>

      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/profile")}
      >
        <Text style={styles.text}>👤 Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/notifications")}
      >
        <Text style={styles.text}>🔔 Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/trip-history")}
      >
        <Text style={styles.text}>📜 Trip History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/earnings")}
      >
        <Text style={styles.text}>💰 Earnings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logout}
        onPress={logout}
      >
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FA",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#111827",
  },

  item: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  text: {
    fontSize: 18,
    color: "#111827",
  },

  logout: {
    marginTop: 30,
    backgroundColor: "#DC2626",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
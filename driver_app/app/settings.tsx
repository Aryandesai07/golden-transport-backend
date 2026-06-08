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
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("driver_id");

      router.replace("/");
    } catch {
      Alert.alert("Error", "Logout failed");
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Success", "Cache Cleared");
    } catch {
      Alert.alert("Error", "Failed to clear cache");
    }
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={28} color="#000" />
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* OPTIONS */}

      <TouchableOpacity style={styles.card} onPress={() => router.push("/profile")}>
        <Ionicons name="person-outline" size={22} color="#2563EB" />
        <Text style={styles.text}>Profile Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push("/notifications")}>
        <Ionicons name="notifications-outline" size={22} color="#2563EB" />
        <Text style={styles.text}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={clearCache}>
        <Ionicons name="trash-outline" size={22} color="#DC2626" />
        <Text style={styles.text}>Clear Cache</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Info", "App Version 1.0")}>
        <Ionicons name="information-circle-outline" size={22} color="#2563EB" />
        <Text style={styles.text}>About App</Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
    elevation: 3,
  },

  text: {
    fontSize: 16,
    fontWeight: "500",
  },

  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#DC2626",
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  }

});
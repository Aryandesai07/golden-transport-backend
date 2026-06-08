import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";
import { router } from "expo-router";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [driverId, setDriverId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const id = await AsyncStorage.getItem("driver_id");

      if (!id) {
        router.replace("/");
        return;
      }

      setDriverId(id);

      const res = await API.get(`/driver/profile/${id}`);

      if (res.data.status === "success") {
        const d = res.data.driver;

        setName(d.name || "");
        setMobile(d.mobile || "");
        setVehicleNo(d.vehicle_no || "");
        setVehicleType(d.vehicle_type || "");
      } else {
        Alert.alert("Error", "Failed to load profile");
      }
    } catch (error: any) {
      console.log("PROFILE LOAD ERROR:", error?.response?.data || error.message);
      Alert.alert("Error", "Server error while loading profile");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const updateProfile = async () => {
    try {
      if (!driverId) return;

      setSaving(true);

      const res = await API.post("/driver/update-profile", {
        driver_id: driverId,
        name,
        mobile,
        vehicle_no: vehicleNo,
        vehicle_type: vehicleType,
      });

      if (res.data.status === "success") {
        Alert.alert("Success", "Profile updated successfully");
        loadProfile();
      } else {
        Alert.alert("Error", res.data.message || "Update failed");
      }
    } catch (error: any) {
      console.log("UPDATE ERROR:", error?.response?.data || error.message);
      Alert.alert("Error", "Server error while updating profile");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Driver Profile</Text>

      {/* INPUT FIELDS */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <TextInput
        style={styles.input}
        placeholder="Vehicle Number"
        value={vehicleNo}
        onChangeText={setVehicleNo}
      />

      <TextInput
        style={styles.input}
        placeholder="Vehicle Type (Truck/Tempo/etc)"
        value={vehicleType}
        onChangeText={setVehicleType}
      />

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={updateProfile}
        disabled={saving}
      >
        <Text style={styles.btnText}>
          {saving ? "Saving..." : "💾 Save Changes"}
        </Text>
      </TouchableOpacity>

      {/* BACK BUTTON */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.btnText}>⬅ Back</Text>
      </TouchableOpacity>
    </View>
  );
}

// =========================
// STYLES
// =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F3F6FA",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  saveBtn: {
    backgroundColor: "#16A34A",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  backBtn: {
    backgroundColor: "#6B7280",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
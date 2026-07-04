import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";
import { router } from "expo-router";

// =====================================
// TYPES
// =====================================

interface DriverProfile {
  id?: number;
  name: string;
  mobile: string;
  vehicle_no: string;
  vehicle_type: string;
  earnings?: number;
}

// =====================================
// MAIN COMPONENT
// =====================================

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [driverId, setDriverId] = useState<number | null>(null);

  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");

  const [documents, setDocuments] = useState<any>(null);

  // =====================================
  // LOAD PROFILE
  // =====================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const storedId = await AsyncStorage.getItem("driver_id");

      if (!storedId) {
        Alert.alert("Session Expired", "Please login again");
        router.replace("/login");
        return;
      }

      const id = Number(storedId);

      if (Number.isNaN(id)) {
        Alert.alert("Error", "Invalid driver session");
        router.replace("/login");
        return;
      }

      setDriverId(id);

      // =========================
      // PROFILE API CALL
      // =========================
      const response = await API.get(`/driver/profile/${id}`);

      if (response?.data?.status === "success") {
        const driver: DriverProfile = response.data.driver;

        setName(driver?.name ?? "");
        setMobile(driver?.mobile ?? "");
        setVehicleNo(driver?.vehicle_no ?? "");
        setVehicleType(driver?.vehicle_type ?? "");
      } else {
        Alert.alert(
          "Error",
          response?.data?.message || "Failed to load profile"
        );
      }

      // =========================
      // DOCUMENT API CALL
      // =========================
      const docRes = await API.get(`/driver/documents/${id}`);

      if (docRes?.data?.status === "success") {
        setDocuments(docRes.data.documents);
      }

    } catch (error: unknown) {
        const err = error as { response?: { data?: any } };

      console.log("PROFILE LOAD ERROR:", err?.response?.data || error);

      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to load profile"
      );

    } finally {
      setLoading(false);
    }
  };
    // =====================================
  // UPDATE PROFILE
  // =====================================

  const updateProfile = async () => {
    try {
      if (!driverId) {
        Alert.alert("Error", "Driver not found");
        return;
      }

      // =========================
      // VALIDATION
      // =========================

      if (!name?.trim()) {
        Alert.alert("Validation", "Please enter full name");
        return;
      }

      if (!mobile?.trim() || !/^[0-9]{10}$/.test(mobile.trim())) {
        Alert.alert("Validation", "Enter valid mobile number");
        return;
      }

      if (!vehicleNo?.trim()) {
        Alert.alert("Validation", "Vehicle number is required");
        return;
      }

      if (!vehicleType?.trim()) {
        Alert.alert("Validation", "Vehicle type is required");
        return;
      }

      // prevent multiple clicks
      if (saving) return;

      setSaving(true);

      const payload = {
        driver_id: driverId,
        name: name.trim(),
        mobile: mobile.trim(),
        vehicle_no: vehicleNo.trim(),
        vehicle_type: vehicleType.trim(),
      };

      console.log("UPDATE PAYLOAD:", payload);

      const response = await API.post(
        "/driver/update-profile",
        payload
      );

      if (response?.data?.status === "success") {
        Alert.alert(
          "Success",
          "Profile updated successfully ✔",
          [
            {
              text: "OK",
              onPress: () => {
                console.log("Profile update confirmed");
              },
            },
          ]
        );

        console.log("PROFILE UPDATED SUCCESS:", response?.data);
      } else {
        Alert.alert(
          "Error",
          response?.data?.message || "Update failed"
        );
      }

    } catch (error: unknown) {
      const err = error as any;

      console.log("UPDATE ERROR:", err?.response?.data || error);

      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to update profile"
      );

    } finally {
      setSaving(false);
    }
  };
    // =====================================
  // LOADING SCREEN
  // =====================================

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />

        <Text style={{ marginTop: 10 }}>
          Loading Profile...
        </Text>
      </View>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        👤 Driver Profile
      </Text>

      {/* ================= DOCUMENT CARD ================= */}
      <View style={styles.card}>
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
          📄 Documents
        </Text>

        <Text>
          License:{" "}
          {documents?.license
            ? "✔ Uploaded"
            : "❌ Missing"}
        </Text>
      </View>

      {/* ================= PROFILE CARD ================= */}
      <View style={styles.card}>
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
          maxLength={10}
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
          placeholder="Vehicle Type"
          value={vehicleType}
          onChangeText={setVehicleType}
        />

        {/* ================= SAVE BUTTON ================= */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            saving && styles.disabledBtn,
          ]}
          onPress={updateProfile}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.btnText}>
              💾 Save Changes
            </Text>
          )}
        </TouchableOpacity>

        {/* ================= BACK BUTTON ================= */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>
            ⬅ Back
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FA",
    padding: 20,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    color: "#111827",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
    elevation: 4,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 15,
    marginBottom: 14,
    fontSize: 16,
    color: "#111827",
  },

  saveBtn: {
    backgroundColor: "#16A34A",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  disabledBtn: {
    opacity: 0.6,
  },

  backBtn: {
    backgroundColor: "#6B7280",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },

  btnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
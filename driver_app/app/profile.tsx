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

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [driverId, setDriverId] =
    useState<number | null>(null);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [vehicleNo, setVehicleNo] =
    useState("");
  const [vehicleType, setVehicleType] =
    useState("");
  // =====================================
  // LOAD PROFILE
  // =====================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const storedId =
        await AsyncStorage.getItem(
          "driver_id"
        );

      if (!storedId) {
        Alert.alert(
          "Session Expired",
          "Please login again"
        );

        router.replace("/");
        return;
      }

      const id = Number(storedId);

      setDriverId(id);

      const response = await API.get(
        `/driver/profile/${id}`
      );

      if (
        response.data.status === "success"
      ) {
        const driver: DriverProfile =
          response.data.driver;

        setName(driver.name || "");
        setMobile(driver.mobile || "");
        setVehicleNo(
          driver.vehicle_no || ""
        );
        setVehicleType(
          driver.vehicle_type || ""
        );
      } else {
        Alert.alert(
          "Error",
          response.data.message ||
            "Failed to load profile"
        );
      }

    } catch (error: any) {
      console.log(
        "PROFILE LOAD ERROR:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Failed to load profile"
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
        Alert.alert(
          "Error",
          "Driver not found"
        );
        return;
      }

      // Validation

      if (!name.trim()) {
        Alert.alert(
          "Validation",
          "Please enter full name"
        );
        return;
      }

      if (
        mobile.trim().length < 10
      ) {
        Alert.alert(
          "Validation",
          "Enter valid mobile number"
        );
        return;
      }

      if (!vehicleNo.trim()) {
        Alert.alert(
          "Validation",
          "Vehicle number is required"
        );
        return;
      }

      if (!vehicleType.trim()) {
        Alert.alert(
          "Validation",
          "Vehicle type is required"
        );
        return;
      }

      setSaving(true);

      const response = await API.post(
        "/driver/update-profile",
        {
          driver_id: driverId,
          name: name.trim(),
          mobile: mobile.trim(),
          vehicle_no:
            vehicleNo.trim(),
          vehicle_type:
            vehicleType.trim(),
        }
      );

      if (
        response.data.status === "success"
      ) {
        Alert.alert(
          "Success",
          "Profile updated successfully"
        );

        // No need to call loadProfile()
        // State already contains latest values

      } else {
        Alert.alert(
          "Error",
          response.data.message ||
            "Update failed"
        );
      }

    } catch (error: any) {
      console.log(
        "UPDATE ERROR:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Failed to update profile"
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
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text
          style={{ marginTop: 10 }}
        >
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
      showsVerticalScrollIndicator={
        false
      }
    >
      <Text style={styles.title}>
        👤 Driver Profile
      </Text>

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
          onChangeText={
            setVehicleType
          }
        />

        <TouchableOpacity
          style={[
            styles.saveBtn,
            saving &&
              styles.disabledBtn,
          ]}
          onPress={updateProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text
              style={styles.btnText}
            >
              💾 Save Changes
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={styles.btnText}
          >
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
    elevation: 4,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 15,
    marginBottom: 14,
    fontSize: 16,
  },

  saveBtn: {
    backgroundColor: "#16A34A",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  disabledBtn: {
    opacity: 0.7,
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
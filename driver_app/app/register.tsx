import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import API from "../services/api";

// =====================================
// TYPES
// =====================================

interface DriverCreate {
  name: string;
  mobile: string;
  password: string;
  vehicle_no: string;
  vehicle_type: string;
}

export default function Register() {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  // =====================================
  // REGISTER DRIVER
  // =====================================

  const handleRegister = async () => {
    try {
      // Validation

      if (
        !name.trim() ||
        !mobile.trim() ||
        !password.trim() ||
        !vehicleNo.trim() ||
        !vehicleType.trim()
      ) {
        Alert.alert(
          "Validation",
          "All fields are required"
        );
        return;
      }

      if (mobile.trim().length !== 10) {
        Alert.alert(
          "Validation",
          "Enter a valid 10-digit mobile number"
        );
        return;
      }

      if (password.trim().length < 6) {
        Alert.alert(
          "Validation",
          "Password must be at least 6 characters"
        );
        return;
      }

      setLoading(true);

      const payload: DriverCreate = {
        name: name.trim(),
        mobile: mobile.trim(),
        password: password.trim(),
        vehicle_no: vehicleNo.trim(),
        vehicle_type: vehicleType.trim(),
      };

      console.log(
        "Register Payload:",
        payload
      );

      const response = await API.post(
        "/driver/register",
        payload
      );

      console.log(
        "Register Response:",
        response.data
      );

      if (response?.data?.status?.toLowerCase() === "success") {
        Alert.alert(
          "Success",
          "Driver registered successfully",
          [
            {
              text: "OK",
              onPress: () =>
                router.push("/login"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Registration Failed",
          response.data.message ||
            "Unable to register driver"
        );
      }

    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      console.log(
        "REGISTER ERROR:",
        err?.response?.data || error
      );

      Alert.alert(
        "Error",
        err?.response?.data?.message ?? "Cannot connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          🚚 Driver Registration
        </Text>

        <Text style={styles.subtitle}>
          Create your Golden Transport account
        </Text>

        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Mobile Number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          maxLength={10}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          placeholder="Vehicle Number"
          value={vehicleNo}
          onChangeText={setVehicleNo}
          style={styles.input}
        />

        <TextInput
          placeholder="Vehicle Type (Truck, Tempo, Pickup, etc.)"
          value={vehicleType}
          onChangeText={setVehicleType}
          style={styles.input}
        />

        <TouchableOpacity
          style={[
            styles.button,
            loading &&
              styles.buttonDisabled,
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.buttonText}>
              Register Driver
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push("/login")
          }
        >
          <Text style={styles.loginText}>
            Already have an account?
            Login
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
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F3F6FA",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 20,
    elevation: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 5,
    marginBottom: 25,
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

  button: {
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  loginText: {
    textAlign: "center",
    marginTop: 18,
    color: "#2563EB",
    fontWeight: "600",
  },
});
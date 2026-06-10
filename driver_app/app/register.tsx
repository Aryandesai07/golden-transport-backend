import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";

import { router } from "expo-router";
import API from "../services/api";

export default function Register() {

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {

    // ✅ VALIDATION
    if (!name || !mobile || !password || !vehicleNo) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (mobile.length < 10) {
      Alert.alert("Error", "Enter valid mobile number");
      return;
    }

    try {

      setLoading(true);

      console.log("Register request sending...");

      const payload = {
        name: name.trim(),
        mobile: mobile.trim(),
        password: password.trim(),
        vehicle_no: vehicleNo.trim(),
        vehicle_type: "Truck"
      };

      console.log("Payload:", payload);

      const res = await API.post("/driver/register", payload);

      console.log("Response:", res.data);

      if (res.data?.status === "success") {

        Alert.alert(
          "Success",
          "Driver Registered Successfully"
        );

        // redirect to login
        router.replace("/login");

      } else {

        Alert.alert(
          "Registration Failed",
          res.data?.message || "Something went wrong"
        );

      }

    } catch (error: any) {

      console.log("REGISTER ERROR:", error?.response?.data || error.message);

      Alert.alert(
        "Server Error",
        error?.response?.data?.message || "Cannot connect to server"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>🚚 Driver Registration</Text>

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

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {
          loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Register Driver
            </Text>
          )
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={styles.loginText}>
          Already have account? Login
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F3F6FA"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd"
  },

  button: {
    backgroundColor: "#16A34A",
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },

  loginText: {
    textAlign: "center",
    marginTop: 15,
    color: "#2563EB"
  }
});
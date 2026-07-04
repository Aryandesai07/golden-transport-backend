import AsyncStorage from "@react-native-async-storage/async-storage";
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

export default function LoginScreen() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================
  // LOGIN
  // =====================================

  const login = async () => {
    try {
      // ===============================
      // VALIDATION
      // ===============================
      if (!mobile.trim() || !password.trim()) {
        Alert.alert("Validation", "Enter Mobile Number & Password");
        return;
      }

      if (mobile.trim().length !== 10) {
        Alert.alert("Validation", "Enter a valid 10 digit mobile number");
        return;
      }

      setLoading(true);

      const API_URL =
        "https://golden-transport-backend-production.up.railway.app";

      console.log("================================");
      console.log("LOGIN URL :", `${API_URL}/driver/login`);
      console.log("MOBILE    :", mobile.trim());
      console.log("================================");

      const res = await fetch(`${API_URL}/driver/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile.trim(),
          password: password.trim(),
        }),
      });

      console.log("STATUS :", res.status);
      console.log("OK     :", res.ok);

      const responseText = await res.text();

      console.log("RAW RESPONSE:");
      console.log(responseText);

      if (!res.ok) {
        setLoading(false);
        throw new Error(responseText || "Server Error");
      }

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.log("JSON PARSE ERROR:", err);
        setLoading(false);
        throw new Error("Invalid JSON received from server");
      }

      console.log("DATA:", data);

      if (data.status !== "success") {
        setLoading(false);

        Alert.alert(
          "Login Failed",
          data.message || "Invalid Mobile Number or Password"
        );

        return;
      }
        // ===============================
    // SAVE SESSION
    // ===============================
    const driver = data.driver;

    if (!driver) {
      throw new Error("Driver data not found.");
    }

    await AsyncStorage.setItem("token", data.token || "");
    await AsyncStorage.setItem("driver_id", String(driver.id));
    await AsyncStorage.setItem("driver_name", driver.name || "");
    await AsyncStorage.setItem("driver_mobile", driver.mobile || "");
    await AsyncStorage.setItem("vehicle_no", driver.vehicle_no || "");
    await AsyncStorage.setItem("vehicle_type", driver.vehicle_type || "");

    console.log("================================");
    console.log("SESSION SAVED");
    console.log("Driver ID   :", driver.id);
    console.log("Driver Name :", driver.name);
    console.log("================================");

    Alert.alert(
      "Success",
      `Welcome ${driver.name}`,
      [
        {
          text: "OK",
          onPress: () => {
            console.log("Opening Dashboard...");
            router.replace("/dashboard");
          },
        },
      ]
    );

  } catch (error) {
    console.log("================================");
    console.log("LOGIN ERROR");
    console.log(error);
    console.log("================================");

    Alert.alert(
      "Connection Error",
      error?.message || "Unable to connect to the server."
    );
  } finally {
    setLoading(false);
  }
};

return (
  <ScrollView
    contentContainerStyle={styles.container}
    keyboardShouldPersistTaps="handled"
  >
    <View style={styles.card}>
      <Text style={styles.logo}>🚚</Text>

      <Text style={styles.title}>
        Golden Transport
      </Text>

      <Text style={styles.subtitle}>
        Driver Login
      </Text>

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

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.disabledButton,
        ]}
        onPress={login}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            Login
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/register")}
        style={{ marginTop: 18 }}
      >
        <Text style={styles.registerText}>
          New Driver? Register Here
        </Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F3F6FA",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 20,

    elevation: 5,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  logo: {
    textAlign: "center",
    fontSize: 65,
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
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
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  registerText: {
    color: "#2563EB",
    textAlign: "center",
    fontWeight: "600",
  },
});
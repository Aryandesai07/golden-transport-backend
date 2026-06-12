import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axios from "axios";

import API from "../services/api";

export default function LoginScreen() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mobile.trim() || !password.trim()) {
      Alert.alert(
        "Validation Error",
        "Enter Mobile Number and Password"
      );
      return;
    }

    if (mobile.trim().length !== 10) {
      Alert.alert(
        "Validation Error",
        "Enter valid 10 digit mobile number"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/driver/login", {
        mobile: mobile.trim(),
        password: password.trim(),
      });

      console.log("LOGIN RESPONSE:", res.data);

      if (res.data?.status === "success") {
        await AsyncStorage.setItem(
          "token",
          res.data.token || "logged_in"
        );

        await AsyncStorage.setItem(
          "driver_id",
          String(
            res.data.driver_id ||
            res.data.driver?.id
          )
        );

        if (res.data.driver?.name) {
          await AsyncStorage.setItem(
            "driver_name",
            res.data.driver.name
          );
        }

        Alert.alert(
          "Success",
          "Login Successful"
        );

        router.replace("/dashboard");
      } else {
        Alert.alert(
          "Login Failed",
          res.data?.message ||
            "Invalid Mobile Number or Password"
        );
      }
    } catch (error: unknown) {
  console.log("LOGIN ERROR:", error);

  let errorMessage = "Cannot connect to server";

  if (error instanceof Error) {
    errorMessage = error.message;
  }

  Alert.alert(
    "Login Failed",
    errorMessage
  );
}
finally {
  setLoading(false);
}
  };

  return (
    <View style={styles.container}>
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
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Login
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push("/register")
          }
        >
          <Text style={styles.link}>
            New Driver? Register Here
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FA",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 20,
    elevation: 5,
  },

  logo: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 10,
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
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  link: {
    textAlign: "center",
    marginTop: 18,
    color: "#2563EB",
    fontWeight: "600",
  },
});
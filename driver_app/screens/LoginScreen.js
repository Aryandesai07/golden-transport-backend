import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

import { router } from "expo-router";
import API from "../services/api";

export default function LoginScreen() {

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {

    if (!mobile || !password) {

      Alert.alert(
        "Error",
        "Enter Mobile Number & Password"
      );

      return;
    }

    try {

      setLoading(true);

      console.log("Sending Login Request...");

      const response = await API.post(
        "/driver/login",
        {
          mobile: mobile.trim(),
          password: password.trim()
        }
      );

      console.log("Response:", response.data);

      if (response.data.status === "success") {

        await AsyncStorage.setItem(
          "driver_id",
          String(response.data.driver_id)
        );

        await AsyncStorage.setItem(
          "driver_name",
          response.data.name
        );

        if (response.data.token) {

          await AsyncStorage.setItem(
            "token",
            response.data.token
          );
        }

        Alert.alert(
          "Login Success",
          `Welcome ${response.data.name}`
        );

        router.replace("/dashboard");

      } else {

        Alert.alert(
          "Login Failed",
          response.data.message || "Invalid Credentials"
        );
      }

    } catch (error) {

  console.log("LOGIN ERROR:", error);

  Alert.alert(
    "Connection Error",
    "Cannot connect to backend"
  );

} finally {

      setLoading(false);
    }
  };

  return (

    <View style={styles.container}>

      <Text style={styles.logo}>
        🚚
      </Text>

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
          loading && styles.disabledButton
        ]}
        onPress={login}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {
            loading
              ? "Please Wait..."
              : "Login"
          }
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F3F6FA"
  },

  logo: {
    textAlign: "center",
    fontSize: 60,
    marginBottom: 10
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F2937"
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 35,
    marginTop: 5
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D1D5DB"
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12
  },

  disabledButton: {
    opacity: 0.7
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  }

});
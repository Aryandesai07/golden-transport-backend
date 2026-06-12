import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import API from "../services/api";

export default function Login() {

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {

    if (!mobile || !password) {
      Alert.alert("Error", "Enter mobile & password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/driver/login", {
        mobile: mobile.trim(),
        password: password.trim()
      });

      if (res.data.status === "success") {

        await AsyncStorage.setItem("token", res.data.token || "true");
        await AsyncStorage.setItem("driver_id", String(res.data.driver_id));

        Alert.alert("Success", "Login Successful");

        router.replace("/dashboard");

      } else {
        Alert.alert("Login Failed", res.data.message);
      }

    } catch (error: any) {
      console.log(error);
      Alert.alert("Network Error", "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>🚚 Driver Login</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>New Driver? Register</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#F5F7FB"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },

  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#2563EB"
  }
});
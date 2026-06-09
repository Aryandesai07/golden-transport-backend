import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from "react-native";

import { router } from "expo-router";
import API from "../services/api";

export default function RegisterScreen() {

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {

    if (
      !name ||
      !mobile ||
      !password ||
      !vehicleNo ||
      !vehicleType
    ) {
      Alert.alert(
        "Error",
        "Please fill all fields"
      );
      return;
    }

    try {

      setLoading(true);

      const response = await API.post(
        "/register",
        {
          name,
          mobile,
          password,
          vehicle_no: vehicleNo,
          vehicle_type: vehicleType
        }
      );

      if (
        response.data.status === "success"
      ) {

        Alert.alert(
          "Success",
          "Registration Completed"
        );

        router.replace("/login");

      } else {

        Alert.alert(
          "Error",
          response.data.message
        );
      }

    } catch (error: any) {

      console.log(error);

      Alert.alert(
        "Server Error",
        "Unable to register"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <Text style={styles.title}>
        Driver Registration
      </Text>

      <TextInput
        placeholder="Driver Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Mobile Number"
        style={styles.input}
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Vehicle Number"
        style={styles.input}
        value={vehicleNo}
        onChangeText={setVehicleNo}
      />

      <TextInput
        placeholder="Vehicle Type"
        style={styles.input}
        value={vehicleType}
        onChangeText={setVehicleType}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={register}
        disabled={loading}
      >

        <Text style={styles.buttonText}>
          {
            loading
              ? "Registering..."
              : "Register Driver"
          }
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.replace("/login")
        }
      >
        <Text style={styles.loginLink}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 20
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 30
  },

  input: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D1D5DB"
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 12,
    marginTop: 10
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  },

  loginLink: {
    textAlign: "center",
    marginTop: 20,
    color: "#2563EB",
    fontWeight: "600"
  }

});
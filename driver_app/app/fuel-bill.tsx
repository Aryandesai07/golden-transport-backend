import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL =
  "https://golden-transport-backend.onrender.com";

export default function FuelBill() {
  const [image, setImage] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const [driverId, setDriverId] = useState<number | null>(null);
  const [cameraGranted, setCameraGranted] = useState(false);

  // =====================================
  // INITIALIZE
  // =====================================

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      // Load Driver
      const id =
        await AsyncStorage.getItem("driver_id");

      if (!id) {
        Alert.alert(
          "Session Expired",
          "Please login again"
        );
        return;
      }

      setDriverId(Number(id));

      // Camera Permission
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      setCameraGranted(permission.granted);

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Camera permission is required"
        );
      }

    } catch (error) {
      console.log(
        "Initialization Error:",
        error
      );

      Alert.alert(
        "Error",
        "Failed to initialize screen"
      );
    }
  };

  // =====================================
  // TAKE PHOTO
  // =====================================

  const pickImage = async () => {
    try {
      if (!cameraGranted) {
        Alert.alert(
          "Permission Required",
          "Camera permission not granted"
        );
        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          quality: 0.7,
          allowsEditing: true,
        });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }

    } catch (error) {
      console.log(
        "Camera Error:",
        error
      );

      Alert.alert(
        "Error",
        "Camera failed"
      );
    }
  };

  // =====================================
  // UPLOAD FUEL BILL
  // =====================================

  const uploadFuelBill = async () => {
    if (!image) {
      Alert.alert(
        "Error",
        "Take a photo first"
      );
      return;
    }

    if (!amount) {
      Alert.alert(
        "Error",
        "Enter amount"
      );
      return;
    }

    if (isNaN(Number(amount))) {
      Alert.alert(
        "Error",
        "Enter valid amount"
      );
      return;
    }

    if (!driverId) {
      Alert.alert(
        "Error",
        "Driver not loaded"
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "amount",
        String(Number(amount))
      );

      formData.append("file", {
        uri: image,
        name: `fuel_${driverId}.jpg`,
        type: "image/jpeg",
      } as any);

      const response = await axios.post(
        `${BASE_URL}/driver/upload-fuel-bill/${driverId}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      Alert.alert(
        "Success",
        "Fuel bill uploaded successfully"
      );

      setImage(null);
      setAmount("");

    } catch (error: any) {
      console.log(
        "Upload Error:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Upload failed"
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ⛽ Fuel Bill Upload
      </Text>

      <TextInput
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={pickImage}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          Take Photo
        </Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
      )}

      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={uploadFuelBill}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.btnText}>
            Upload Fuel Bill
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F3F6FA",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },

  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 12,
  },

  uploadBtn: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 15,
  },

  btnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 15,
  },
});
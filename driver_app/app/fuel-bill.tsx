import React, { useState } from "react";
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
import axios from "axios";

const BASE_URL = "http://192.168.31.182:8000";

export default function FuelBill() {
  const [image, setImage] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const driverId = 1;

  // 📸 PICK IMAGE
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission Required", "Camera permission needed");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        allowsEditing: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Camera failed");
    }
  };

  // 🚀 UPLOAD
  const uploadFuelBill = async () => {
    if (!image) return Alert.alert("Error", "Take a photo first");
    if (!amount) return Alert.alert("Error", "Enter amount");

    setLoading(true);

    const formData = new FormData();

    formData.append("amount", amount);

    formData.append("file", {
      uri: image,
      name: "fuel.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const res = await axios.post(
        `${BASE_URL}/driver/upload-fuel-bill/${driverId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);

      Alert.alert("Success", "Fuel bill uploaded");

      setImage(null);
      setAmount("");
    } catch (error) {
      console.log(error);
      Alert.alert("Upload Failed", "Check backend or network");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⛽ Fuel Bill Upload</Text>

      <TextInput
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.btnText}>Take Photo</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={uploadFuelBill}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Upload Fuel Bill</Text>
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
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  uploadBtn: {
    backgroundColor: "#16A34A",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 15,
    borderRadius: 10,
  },
});
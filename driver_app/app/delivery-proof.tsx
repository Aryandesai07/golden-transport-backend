import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://golden-transport-backend-production.up.railway.app";

export default function DeliveryProof() {

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [driverId, setDriverId] = useState<number | null>(null);

  const tripId = 1; // 🔥 replace later with real trip selection

  // LOAD DRIVER ID (PROPER WAY)
  useEffect(() => {
    const loadDriver = async () => {
      try {
        const id = await AsyncStorage.getItem("driver_id");
        if (id) {
          setDriverId(Number(id));
        } else {
          setDriverId(1); // fallback for testing
        }
      } catch (error) {
        console.log("Driver load error:", error);
        setDriverId(1);
      }
    };

    loadDriver();
  }, []);

  // TAKE PHOTO
  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission Required", "Camera permission is required");
        return;
      }

      setLoading(true);

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Camera failed");
    }

    setLoading(false);
  };

  // UPLOAD PROOF
  const uploadProof = async () => {

    if (!image) {
      Alert.alert("Error", "Capture image first");
      return;
    }

    if (!driverId) {
      Alert.alert("Error", "Driver not loaded");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("file", {
      uri: image,
      name: "proof.jpg",
      type: "image/jpeg"
    } as any);

    try {

      const res = await axios.post(
        `${BASE_URL}/driver/upload-proof/${tripId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log(res.data);

      Alert.alert("Success", "Proof uploaded successfully");

      setImage(null);

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Upload failed");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>📷 Delivery Proof</Text>

      <Text style={styles.subtitle}>
        Capture customer delivery proof
      </Text>

      {/* CAMERA BUTTON */}
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.btnText}>Capture Photo</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#16A34A" />
      )}

      {/* IMAGE PREVIEW */}
      {image && (
        <>
          <Image source={{ uri: image }} style={styles.image} />

          <TouchableOpacity style={styles.uploadBtn} onPress={uploadProof}>
            <Text style={styles.btnText}>Upload Proof</Text>
          </TouchableOpacity>
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F3F6FA"
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20
  },

  button: {
    backgroundColor: "#16A34A",
    padding: 15,
    borderRadius: 12
  },

  uploadBtn: {
    marginTop: 15,
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 10
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold"
  },

  image: {
    width: 320,
    height: 400,
    marginTop: 20,
    borderRadius: 15
  }
});
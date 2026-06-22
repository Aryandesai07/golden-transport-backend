import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";

const BASE_URL =
  "https://golden-transport-backend-production.up.railway.app";

export default function DeliveryProof() {
  const { tripId } = useLocalSearchParams<{
    tripId: string;
  }>();

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [driverId, setDriverId] = useState<number | null>(null);
  const [cameraGranted, setCameraGranted] = useState(false);

  // =====================================
  // INITIALIZE SCREEN
  // =====================================

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const id = await AsyncStorage.getItem("driver_id");

      if (!id) {
        Alert.alert(
          "Session Expired",
          "Please login again"
        );

        router.replace("/");
        return;
      }

      setDriverId(Number(id));

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
      console.log("Initialization Error:", error);

      Alert.alert(
        "Error",
        "Failed to initialize screen"
      );
    }
  };

  // =====================================
  // TAKE PHOTO
  // =====================================

  const takePhoto = async () => {
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
          mediaTypes:
            ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
          allowsEditing: true,
        });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Camera Error:", error);

      Alert.alert(
        "Error",
        "Failed to open camera"
      );
    }
  };

  // =====================================
  // UPLOAD PROOF
  // =====================================

  const uploadProof = async () => {
    if (!image) {
      Alert.alert(
        "Error",
        "Capture image first"
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

    if (!tripId) {
      Alert.alert(
        "Error",
        "Trip not found"
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", {
        uri: image,
        name: `proof_${driverId}_${tripId}.jpg`,
        type: "image/jpeg",
      } as any);

      const response = await axios.post(
        `${BASE_URL}/driver/upload-proof/${tripId}`,
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
        "Proof uploaded successfully",
        [
          {
            text: "OK",
            onPress: () => {
              setImage(null);
              router.back();
            },
          },
        ]
      );
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
        📷 Delivery Proof
      </Text>

      <Text style={styles.subtitle}>
        Capture customer delivery proof
      </Text>

      <Text style={styles.tripText}>
        Trip ID: {tripId || "N/A"}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={takePhoto}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          Capture Photo
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#16A34A"
          style={{ marginTop: 20 }}
        />
      )}

      {image && (
        <>
          <Image
            source={{ uri: image }}
            style={styles.image}
          />

          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={uploadProof}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              Upload Proof
            </Text>
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
    backgroundColor: "#F3F6FA",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },

  tripText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
    color: "#2563EB",
  },

  button: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 12,
  },

  uploadBtn: {
    marginTop: 15,
    backgroundColor: "#2563EB",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 12,
  },

  btnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  image: {
    width: 320,
    height: 400,
    marginTop: 20,
    borderRadius: 15,
  },
});
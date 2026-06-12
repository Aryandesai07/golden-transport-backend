import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import * as Location from "expo-location";
import API from "../services/api";

export default function LocationScreen() {
  const [driverId, setDriverId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [lastUpdated, setLastUpdated] =
    useState("Waiting...");

  const [trackingStatus, setTrackingStatus] =
    useState("Initializing...");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null =
      null;

    const initializeTracking = async () => {
      try {
        const storedDriverId =
          await AsyncStorage.getItem("driver_id");

        if (!storedDriverId) {
          Alert.alert(
            "Session Expired",
            "Please login again"
          );

          router.replace("/login");
          return;
        }

        const id = Number(storedDriverId);

        setDriverId(id);

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setTrackingStatus("Permission Denied");

          Alert.alert(
            "Permission Denied",
            "Location permission required"
          );

          return;
        }

        setTrackingStatus("Tracking Active");

        await sendLocation(id);

        interval = setInterval(() => {
          sendLocation(id);
        }, 30000);

      } catch (error) {
        console.log(
          "TRACKING ERROR:",
          error
        );

        Alert.alert(
          "Error",
          "Failed to start GPS tracking"
        );
      } finally {
        setLoading(false);
      }
    };

    initializeTracking();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const sendLocation = async (
    currentDriverId: number
  ) => {
    try {
      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const lat =
        location.coords.latitude;

      const lng =
        location.coords.longitude;

      setLatitude(lat);
      setLongitude(lng);

      await API.post("/driver/location", {
        driver_id: currentDriverId,
        latitude: lat,
        longitude: lng,
      });

      setLastUpdated(
        new Date().toLocaleTimeString()
      );

      setTrackingStatus("Tracking Active");

      console.log(
        "GPS Updated:",
        lat,
        lng
      );

    } catch (error) {
      console.log(
        "LOCATION ERROR:",
        error
      );

      setTrackingStatus(
        "Update Failed"
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={{ marginTop: 10 }}>
          Starting GPS Tracking...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.header}>
        📍 Live GPS Tracking
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Driver ID
        </Text>

        <Text style={styles.value}>
          {driverId ?? "N/A"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Tracking Status
        </Text>

        <Text style={styles.active}>
          {trackingStatus}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Latitude
        </Text>

        <Text style={styles.value}>
          {latitude
            ? latitude.toFixed(6)
            : "--"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Longitude
        </Text>

        <Text style={styles.value}>
          {longitude
            ? longitude.toFixed(6)
            : "--"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Last Updated
        </Text>

        <Text style={styles.value}>
          {lastUpdated}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          router.replace("/dashboard")
        }
      >
        <Text style={styles.backText}>
          ← Back To Dashboard
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        GPS location is automatically
        sent to the server every
        30 seconds.
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FA",
    padding: 20,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 3,
  },

  label: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 4,
  },

  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  active: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#16A34A",
  },

  backButton: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },

  backText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },

  footer: {
    textAlign: "center",
    marginTop: 20,
    color: "#6B7280",
    fontSize: 14,
  },
});
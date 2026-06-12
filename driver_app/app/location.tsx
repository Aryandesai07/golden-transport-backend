import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import * as Location from "expo-location";
import API from "../services/api";

export default function LocationScreen() {
  const [driverId, setDriverId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [lastUpdated, setLastUpdated] =
    useState<string>("Waiting...");

  const [trackingStatus, setTrackingStatus] =
    useState("Initializing...");

  useEffect(() => {
    let interval: ReturnType<
      typeof setInterval
    > | null = null;

    const initializeTracking = async () => {
      try {
        const storedDriverId =
          await AsyncStorage.getItem(
            "driver_id"
          );

        if (!storedDriverId) {
          Alert.alert(
            "Session Expired",
            "Please login again"
          );
          return;
        }

        setDriverId(Number(storedDriverId));

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission required"
          );

          setTrackingStatus(
            "Permission Denied"
          );

          return;
        }

        setTrackingStatus(
          "Tracking Active"
        );

        await sendLocation(
          Number(storedDriverId)
        );

        interval = setInterval(() => {
          sendLocation(
            Number(storedDriverId)
          );
        }, 30000);

      } catch (error) {
        console.log(error);

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

  // =====================================
  // SEND LOCATION
  // =====================================

  const sendLocation = async (
    currentDriverId: number
  ) => {
    try {
      const location =
        await Location.getCurrentPositionAsync(
          {
            accuracy:
              Location.Accuracy.High,
          }
        );

      const lat =
        location.coords.latitude;

      const lng =
        location.coords.longitude;

      setLatitude(lat);
      setLongitude(lng);

      await API.post(
        "/driver/location",
        {
          driver_id:
            currentDriverId,
          latitude: lat,
          longitude: lng,
        }
      );

      setLastUpdated(
        new Date().toLocaleTimeString()
      );

      console.log(
        "GPS Updated:",
        lat,
        lng
      );

    } catch (error: any) {
      console.log(
        "Location Error:",
        error
      );

      setTrackingStatus(
        "Update Failed"
      );
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text>
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
          Status
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

      <Text style={styles.footer}>
        GPS updates are sent to the
        server every 30 seconds.
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
    marginTop: 20,
    marginBottom: 25,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },

  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },

  active: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#16A34A",
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
});
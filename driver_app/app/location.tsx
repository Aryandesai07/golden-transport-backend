import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  Alert
} from "react-native";

import * as Location from "expo-location";
import API from "../services/api";

export default function LocationScreen() {

  useEffect(() => {

    let interval: any;

    const startTracking = async () => {

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {

        Alert.alert(
          "Permission Denied",
          "Location permission required"
        );

        return;
      }

      sendLocation();

      interval = setInterval(() => {
        sendLocation();
      }, 30000); // every 30 sec
    };

    startTracking();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };

  }, []);

  const sendLocation = async () => {

  try {

    const storedDriverId =
      await AsyncStorage.getItem("driver_id");

    if (!storedDriverId) {
      return;
    }

    const location =
      await Location.getCurrentPositionAsync({});

    await API.post(
      "/driver/location",
      {
        driver_id: Number(storedDriverId),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    );

    console.log(
      "GPS Updated:",
      location.coords.latitude,
      location.coords.longitude
    );

  } catch (error) {

    console.log(
      "Location Error:",
      error
    );
  }
};

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        📍 GPS Tracking Active
      </Text>

      <Text style={styles.subtitle}>
        Your location is updating every 30 seconds
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F6FA"
  },

  title: {
    fontSize: 24,
    fontWeight: "bold"
  },

  subtitle: {
    marginTop: 10,
    color: "#666"
  }

});
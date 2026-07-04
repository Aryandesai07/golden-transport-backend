import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";

export default function LiveLocationScreen() {
  const { theme } = useTheme();

  const [enabled, setEnabled] = useState(true);
  const [latitude, setLatitude] = useState("--");
  const [longitude, setLongitude] = useState("--");
  const [loading, setLoading] = useState(true);

  const fetchLocation = useCallback(async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location permission is required."
        );
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      setLatitude(location.coords.latitude.toFixed(6));
      setLongitude(location.coords.longitude.toFixed(6));
    } catch (error) {
      console.log("Location Error:", error);

      Alert.alert(
        "Location Error",
        "Unable to fetch current location."
      );
    }
  }, []);

  const initialize = useCallback(async () => {
    try {
      const saved =
        (await AsyncStorage.getItem("liveLocation")) !==
        "false";

      setEnabled(saved);

      if (saved) {
        await fetchLocation();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [fetchLocation]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const toggleLocation = async (value: boolean) => {
    setEnabled(value);

    await AsyncStorage.setItem(
      "liveLocation",
      value.toString()
    );

    if (value) {
      await fetchLocation();
    } else {
      setLatitude("--");
      setLongitude("--");
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loading,
          {
            backgroundColor:
              theme.colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={28}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
          },
        ]}
      >
        Live Location
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.text,
              },
            ]}
          >
            Enable Live Location
          </Text>

          <Switch
            value={enabled}
            onValueChange={toggleLocation}
            trackColor={{
              false: "#767577",
              true: theme.colors.primary,
            }}
          />
        </View>

        <View style={styles.divider} />

        <Text
          style={[
            styles.coordinate,
            {
              color: theme.colors.secondary,
            },
          ]}
        >
          Latitude : {latitude}
        </Text>

        <Text
          style={[
            styles.coordinate,
            {
              color: theme.colors.secondary,
            },
          ]}
        >
          Longitude : {longitude}
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                theme.colors.primary,
            },
          ]}
          onPress={fetchLocation}
        >
          <MaterialCommunityIcons
            name="crosshairs-gps"
            size={22}
            color="#fff"
          />

          <Text style={styles.buttonText}>
            Refresh Location
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 25,
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 18,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#D1D5DB",
    marginVertical: 20,
  },

  coordinate: {
    fontSize: 16,
    marginBottom: 10,
  },

  button: {
    marginTop: 25,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 10,
  },
});
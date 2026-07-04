import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

export default function VehicleScreen() {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);

  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  useEffect(() => {
    loadVehicle();
  }, []);

  const loadVehicle = async () => {
    setVehicleNo(
      (await AsyncStorage.getItem("vehicle_no")) || "Not Available"
    );

    setVehicleType(
      (await AsyncStorage.getItem("vehicle_type")) || "Not Available"
    );

    setLoading(false);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loading,
          { backgroundColor: theme.colors.background },
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
        paddingBottom: 40,
      }}
    >
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.text },
          ]}
        >
          Vehicle Details
        </Text>

        <View style={{ width: 28 }} />
      </View>

      {/* Vehicle Card */}

      <View
        style={[
          styles.vehicleCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="truck-fast"
          size={90}
          color={theme.colors.primary}
        />

        <Text
          style={[
            styles.vehicleNumber,
            { color: theme.colors.text },
          ]}
        >
          {vehicleNo}
        </Text>

        <Text
          style={{
            color: theme.colors.secondary,
            fontSize: 16,
          }}
        >
          {vehicleType}
        </Text>
      </View>

      {/* Details */}

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <VehicleRow
          icon="identifier"
          title="Vehicle Number"
          value={vehicleNo}
        />

        <VehicleRow
          icon="truck"
          title="Vehicle Type"
          value={vehicleType}
        />

        <VehicleRow
          icon="factory"
          title="Manufacturer"
          value="Tata Motors"
        />

        <VehicleRow
          icon="car-info"
          title="Model"
          value="2024 Model"
        />

        <VehicleRow
          icon="calendar"
          title="Registration Year"
          value="2024"
        />

        <VehicleRow
          icon="gas-station"
          title="Fuel Type"
          value="Diesel"
        />

        <VehicleRow
          icon="weight"
          title="Load Capacity"
          value="10 Tons"
        />

        <VehicleRow
          icon="account-check"
          title="Assigned Driver"
          value="Current Driver"
        />
      </View>

      {/* Status */}

      <View
        style={[
          styles.statusCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="check-decagram"
          size={26}
          color={theme.colors.success}
        />

        <View style={{ marginLeft: 15 }}>
          <Text
            style={{
              color: theme.colors.text,
              fontWeight: "700",
              fontSize: 17,
            }}
          >
            Vehicle Status
          </Text>

          <Text
            style={{
              color: theme.colors.success,
              marginTop: 4,
            }}
          >
            Active & Ready for Dispatch
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function VehicleRow({
  icon,
  title,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  value: string;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={theme.colors.primary}
      />

      <View style={{ marginLeft: 15 }}>
        <Text
          style={{
            color: theme.colors.secondary,
            fontSize: 13,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: theme.colors.text,
            fontWeight: "700",
            fontSize: 16,
            marginTop: 3,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  vehicleCard: {
    alignItems: "center",
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },

  vehicleNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 15,
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginTop: 20,
  },
});
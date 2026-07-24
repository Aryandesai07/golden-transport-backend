import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Truck {
  id: number;
  vehicle_no: string;
  vehicle_type: string;
  vehicle_model?: string;
  status: string;
}

export default function MyTrucks() {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);

  const [trucks, setTrucks] = useState<Truck[]>([]);

  useEffect(() => {
    loadTrucks();
  }, []);

  const loadTrucks = async () => {
  try {
    const driverId = await AsyncStorage.getItem("driver_id");

    const response = await fetch(
      `https://golden-transport-backend.onrender.com/driver/my-trucks?driver_id=${driverId}`
    );

    const result = await response.json();

    if (result.status === "success") {
      setTrucks(result.trucks);
    } else {
      setTrucks([]);
    }
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
};

  const statusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "#22C55E";

      case "REJECTED":
        return "#EF4444";

      default:
        return "#F59E0B";
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loading,
          {
            backgroundColor: theme.colors.background,
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
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 18,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color={theme.colors.text}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.header,
              {
                color: theme.colors.text,
              },
            ]}
          >
            My Trucks
          </Text>
        </View>

        {/* Fleet Card */}

        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="truck-fast"
            size={42}
            color={theme.colors.primary}
          />

          <View style={{ marginLeft: 15 }}>
            <Text
              style={[
                styles.summaryTitle,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              Fleet Management
            </Text>

            <Text
              style={{
                color: theme.colors.secondary,
              }}
            >
              Total Trucks : {trucks.length}
            </Text>
          </View>
        </View>

        {/* Truck List */}

        {trucks.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="truck-outline"
              size={70}
              color={theme.colors.secondary}
            />

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              No Trucks Added
            </Text>

            <Text
              style={{
                color: theme.colors.secondary,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Add your trucks to receive
              more transport orders.
            </Text>
          </View>
        ) : (
          trucks.map((truck) => (
            <View
              key={truck.id}
              style={[
                styles.truckCard,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="truck"
                  size={34}
                  color={theme.colors.primary}
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 14,
                  }}
                >
                  <Text
                    style={[
                      styles.vehicleNo,
                      {
                        color: theme.colors.text,
                      },
                    ]}
                  >
                    {truck.vehicle_no}
                  </Text>

                  <Text
                    style={{
                      color: theme.colors.secondary,
                    }}
                  >
                    {truck.vehicle_type}
                  </Text>

                  {truck.vehicle_model && (
                    <Text
                      style={{
                        color:
                          theme.colors.secondary,
                      }}
                    >
                      {truck.vehicle_model}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    backgroundColor:
                      statusColor(truck.status),
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 25,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "700",
                    }}
                  >
                    {truck.status}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating Button */}

      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
        onPress={() =>
          router.push("/settings/add-truck" as any)
        }
      >
        <MaterialCommunityIcons
          name="plus"
          size={30}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    marginLeft: 15,
  },

  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 25,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 40,
    alignItems: "center",
    marginTop: 30,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 18,
  },

  truckCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  vehicleNo: {
    fontSize: 18,
    fontWeight: "700",
  },

  fab: {
    position: "absolute",
    right: 22,
    bottom: 30,
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
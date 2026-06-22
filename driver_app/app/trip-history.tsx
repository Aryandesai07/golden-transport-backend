import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";

import API from "../services/api";

// =====================================
// TYPES
// =====================================

interface Trip {
  trip_id: number;
  pickup: string;
  drop: string;
  status: string;
  completed_at?: string;
}

export default function TripHistory() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  // =====================================
  // LOAD HISTORY
  // =====================================

  const loadHistory = async () => {
    try {
      const driverId =
        await AsyncStorage.getItem("driver_id");

      if (!driverId) {
        Alert.alert(
          "Session Expired",
          "Please login again"
        );
        return;
      }

      const response = await API.get(
        `/driver/trip-history/${driverId}`
      );

      if (
        response.data.status === "success"
      ) {
        setTrips(
          response.data.trips || []
        );
      } else {
        setTrips([]);
      }

    } catch (error: any) {
      console.log(
        "Trip History Error:",
        error
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Failed to load trip history"
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================
  // REFRESH
  // =====================================

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  // =====================================
  // LOADER
  // =====================================

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={{ marginTop: 10 }}>
          Loading Trip History...
        </Text>
      </View>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {/* HEADER */}

      <Text style={styles.header}>
        📋 Trip History
      </Text>

      {/* SUMMARY CARD */}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryNumber}>
          {trips.length}
        </Text>

        <Text style={styles.summaryText}>
          Completed Trips
        </Text>
      </View>

      {/* EMPTY STATE */}

      {trips.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            🚚
          </Text>

          <Text style={styles.emptyText}>
            No Completed Trips Found
          </Text>

          <Text
            style={styles.emptySubText}
          >
            Completed deliveries will
            appear here.
          </Text>
        </View>
      ) : (
        trips.map((trip) => (
          <View
            key={trip.trip_id}
            style={styles.card}
          >
            {/* TOP ROW */}

            <View style={styles.topRow}>
              <Text style={styles.tripId}>
                🚚 Trip #{trip.trip_id}
              </Text>

              <View
                style={
                  styles.statusBadge
                }
              >
                <Text
                  style={
                    styles.statusText
                  }
                >
                  DELIVERED
                </Text>
              </View>
            </View>

            {/* PICKUP */}

            <View
              style={styles.routeBox}
            >
              <Text
                style={
                  styles.routeLabel
                }
              >
                PICKUP
              </Text>

              <Text
                style={
                  styles.routeText
                }
              >
                📍 {trip.pickup}
              </Text>
            </View>

            {/* DROP */}

            <View
              style={styles.routeBox}
            >
              <Text
                style={
                  styles.routeLabel
                }
              >
                DESTINATION
              </Text>

              <Text
                style={
                  styles.routeText
                }
              >
                🎯 {trip.drop}
              </Text>
            </View>

            {/* DATE */}

            {trip.completed_at && (
              <Text
                style={styles.date}
              >
                📅 Completed:
                {" "}
                {new Date(
                  trip.completed_at
                ).toLocaleDateString()}
              </Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FA",
    padding: 15,
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
    marginBottom: 20,
    color: "#111827",
  },

  summaryCard: {
    backgroundColor: "#2563EB",
    borderRadius: 18,
    padding: 25,
    marginBottom: 20,
    alignItems: "center",
  },

  summaryNumber: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  summaryText: {
    color: "#FFFFFF",
    marginTop: 5,
    fontSize: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 4,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  tripId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: "#15803D",
    fontWeight: "bold",
    fontSize: 12,
  },

  routeBox: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  routeLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "bold",
    marginBottom: 5,
  },

  routeText: {
    fontSize: 15,
    color: "#111827",
  },

  date: {
    marginTop: 10,
    color: "#6B7280",
    fontSize: 13,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: 35,
    borderRadius: 18,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  emptySubText: {
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
});
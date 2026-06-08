import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function TripHistory() {

  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {

    try {

      const driverId =
        await AsyncStorage.getItem("driver_id");

      const res = await API.get(
        `/driver/trip-history/${driverId}`
      );

      if (res.data.status === "success") {
        setTrips(res.data.trips);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  if (loading) {

    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />
      </View>
    );
  }

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.header}>
        📋 Trip History
      </Text>

      {trips.length === 0 ? (

        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No Completed Trips Found
          </Text>
        </View>

      ) : (

        trips.map((trip) => (

          <View
            key={trip.trip_id}
            style={styles.card}
          >

            <Text style={styles.tripId}>
              Trip #{trip.trip_id}
            </Text>

            <Text>
              📍 Pickup: {trip.pickup}
            </Text>

            <Text>
              🎯 Drop: {trip.drop}
            </Text>

            <Text style={styles.delivered}>
              ✅ Delivered
            </Text>

          </View>

        ))

      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F3F6FA",
    padding: 15
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15
  },

  tripId: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  delivered: {
    color: "green",
    fontWeight: "bold",
    marginTop: 8
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 15,
    alignItems: "center"
  },

  emptyText: {
    fontSize: 16,
    color: "#666"
  }

});
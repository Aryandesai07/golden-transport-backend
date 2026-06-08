import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";

import { router } from "expo-router";
import API from "../services/api";

export default function Dashboard() {

  const [driver, setDriver] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // ✅ AUTO FETCH TRIPS
  useEffect(() => {
    if (driver?.id) {
      fetchTrips(driver.id);
    }
  }, [driver]);

  // ✅ FETCH TRIPS
  const fetchTrips = async (driverId: number) => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://golden-transport-backend-production.up.railway.app/driver/trips/${driverId}`
      );

      const data = await response.json();

      console.log("Trips Response:", data);

      // ✅ SAFE HANDLING
      if (Array.isArray(data)) {
        setTrips(data);
      } else if (Array.isArray(data.trips)) {
        setTrips(data.trips);
      } else {
        setTrips([]);
      }

    } catch (error) {
      console.log("Fetch Trips Error:", error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOGOUT
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("driver_id");

      router.replace("/");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };
  const loadData = async () => {
  try {

    const driverId =
      await AsyncStorage.getItem("driver_id");

    if (!driverId) {
      router.replace("/");
      return;
    }

    const profileRes =
      await API.get(`/driver/profile/${driverId}`);

    const tripRes =
      await API.get(`/driver/trips/${driverId}`);

    if (profileRes.data.status === "success") {
      setDriver(profileRes.data.driver);
    }

    if (tripRes.data.status === "success") {
      setTrips(tripRes.data.trips);
    }

  } catch (error) {

    console.log(error);

    Alert.alert(
      "Error",
      "Failed to load dashboard"
    );

  } finally {

    setLoading(false);
  }
};

  const updateStatus = async (
  tripId: number,
  status: string
) => {

  try {

    const response = await API.post(
      "/driver/update-status",
      {
        trip_id: tripId,
        status: status
      }
    );

    console.log("Update Response:", response.data);

    Alert.alert(
      "Success",
      `Trip Updated To ${status}`
    );

    loadData();

  } catch (error) {

    console.log("Update Status Error:", error);

    Alert.alert(
      "Error",
      "Status update failed"
    );
  }
};

if (loading) {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" />
      <Text>Loading Dashboard...</Text>
    </View>
  );
}

return (
  <ScrollView style={styles.container}>

  <Text style={styles.header}>
  🚚 Golden Transport
</Text>

{driver ? (
  <View style={styles.profileCard}>

    <Text style={styles.driverName}>
      👤 {driver.name ?? "N/A"}
    </Text>

    <Text>
      📱 {driver.mobile ?? "N/A"}
    </Text>

    <Text>
      🚛 Vehicle : {driver.vehicle_no ?? "N/A"}
    </Text>

    <Text>
      📦 Type : {driver.vehicle_type ?? "N/A"}
    </Text>

    <Text>
      💰 Earnings : ₹{driver.earnings ?? 0}
    </Text>

  </View>
) : (
  <View style={{ alignItems: "center", marginTop: 15 }}>
    <Text style={{ color: "#777" }}>
      Loading driver details...
    </Text>
  </View>
)}

      <View style={styles.quickActions}>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            router.push("/location")
          }
        >
          <Text style={styles.actionText}>
            📍 GPS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            router.push("/fuel-bill")
          }
        >
          <Text style={styles.actionText}>
            ⛽ Fuel Bill
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.quickActions}>

  <TouchableOpacity
    style={styles.actionBtn}
    onPress={() => router.push("/delivery-proof")}
  >
    <Text style={styles.actionText}>
      📷 Proof
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.sosBtn}
    onPress={() => router.push("/sos")}
  >
    <Text style={styles.actionText}>
      🚨 SOS
    </Text>
  </TouchableOpacity>

</View>

<View style={styles.quickActions}>

  <TouchableOpacity
    style={styles.actionBtn}
    onPress={() => router.push("/earnings")}
  >
    <Text style={styles.actionText}>
      💰 Earnings
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.actionBtn}
    onPress={() => router.push("/notifications")}
  >
    <Text style={styles.actionText}>
      🔔 Notifications
    </Text>
  </TouchableOpacity>
</View>
<View style={styles.quickActions}>

  <TouchableOpacity
    style={styles.actionBtn}
    onPress={() => router.push("/trip-history")}
  >
    <Text style={styles.actionText}>
      📋 Trip History
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.actionBtn}
    onPress={logout}
  >
    <Text style={styles.actionText}>
      🚪 Logout
    </Text>
  </TouchableOpacity>

</View>

      <Text style={styles.sectionTitle}>
        Assigned Trips
      </Text>

      {trips?.length > 0 ? (
  trips.map((trip) => (
    <View key={trip.trip_id} style={styles.tripCard}>

      <Text style={styles.tripTitle}>
        🚚 Trip #{trip.trip_id}
      </Text>

      <Text>📍 Pickup: {trip.pickup}</Text>

      <Text>🎯 Drop: {trip.drop}</Text>

      <Text>
        🚦 Status:{" "}
        <Text style={{ fontWeight: "bold" }}>
          {trip.status}
        </Text>
      </Text>

      <View style={{ marginTop: 10 }}>

        <TouchableOpacity
          style={styles.blueBtn}
          onPress={() => updateStatus(trip.trip_id, "STARTED")}
        >
          <Text style={styles.btnText}>Start Trip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.blueBtn}
          onPress={() => updateStatus(trip.trip_id, "REACHED_PICKUP")}
        >
          <Text style={styles.btnText}>Reached Pickup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.blueBtn}
          onPress={() => updateStatus(trip.trip_id, "LOADED")}
        >
          <Text style={styles.btnText}>Loaded</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.blueBtn}
          onPress={() => updateStatus(trip.trip_id, "IN_TRANSIT")}
        >
          <Text style={styles.btnText}>In Transit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.greenBtn}
          onPress={() => updateStatus(trip.trip_id, "DELIVERED")}
        >
          <Text style={styles.btnText}>Delivered</Text>
        </TouchableOpacity>

      </View>

    </View>
  ))
) : (
  <Text style={{ padding: 15, textAlign: "center", color: "#777" }}>
    🚫 No trips assigned yet
  </Text>
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
    marginBottom: 15,
    color: "#111"
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3
  },

  driverName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000"
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },

  actionBtn: {
    backgroundColor: "#2563EB",
    width: "48%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center"
  },
  sosBtn: {
    backgroundColor: "#DC2626",
    width: "48%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center"
  },

  actionText: {
    color: "#FFFFFF",
    fontWeight: "bold"
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15
  },

  tripCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15
  },

  tripTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  blueBtn: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 10,
    marginTop: 10
  },

  greenBtn: {
    backgroundColor: "#16A34A",
    padding: 12,
    borderRadius: 10,
    marginTop: 10
  },

  btnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold"
  },
  logoutBtn: {
    backgroundColor: "#DC2626",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20
  },
});
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import API from "../services/api";

// ======================================
// TYPES
// ======================================

interface Driver {
  id: number;
  name: string;
  mobile: string;
  vehicle_no: string;
  vehicle_type: string;
  earnings: number;
}

interface Trip {
  trip_id: number;
  pickup: string;
  drop: string;
  status: string;
}

export default function Dashboard() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // ======================================
  // FETCH TRIPS
  // ======================================

  const fetchTrips = useCallback(async (driverId: number, token: string) => {
  try {
    const response = await API.get(`/driver/trips/${driverId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.status === "success") {
      setTrips(response.data.trips || []);
    } else {
      setTrips([]);
    }
  } catch (error: any) {
    console.log("Fetch Trips Error:", error);
    setTrips([]);
  }
}, []);
  // ======================================
  // LOAD DASHBOARD
  // ======================================

  const loadData = useCallback(async () => {
  try {
    setLoading(true);

    const storedDriverId = await AsyncStorage.getItem("driver_id");
    const storedToken = await AsyncStorage.getItem("token");

    if (!storedDriverId || !storedToken) {
      router.replace("/login");
      return;
    }

    const driverId = Number(storedDriverId);

    const profileRes = await API.get(`/driver/profile/${driverId}`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    });

    if (profileRes.data?.status === "success") {
      setDriver(profileRes.data.driver);
    }

    await fetchTrips(driverId, storedToken);

  } catch (error: any) {
    console.log("Dashboard Error:", error);
  } finally {
    setLoading(false);
  }
}, [fetchTrips]);


  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateStatus = async (tripId: number, status: string) => {
  try {
    const token = await AsyncStorage.getItem("token");  // ✅ get token

    const response = await API.post(
      "/driver/update-status",
      { trip_id: tripId, status },
      { headers: { Authorization: `Bearer ${token}` } }  // ✅ secure call
    );

    Alert.alert("Success", response.data.message || `Trip Updated To ${status}`);

    // Refresh only trips
    if (driver?.id && token) {
      fetchTrips(driver.id, token);  // ✅ pass token
    }
  } catch (error: any) {
    console.log("Update Status Error:", error);
    Alert.alert("Error", error?.response?.data?.message || "Status update failed");
  }
};


  // ======================================
// LOGOUT
// ======================================
const logout = async () => {
  try {
    // Clear all stored driver session data
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("driver_id");
    await AsyncStorage.removeItem("driver_name");
    // await AsyncStorage.removeItem("termsAccepted"); // only if you want reset

    // Redirect to login screen
    router.replace("/login");
  } catch (error) {
    console.log("Logout Error:", error);
    Alert.alert("Error", "Logout failed, please try again.");
  }
};


  // ======================================
  // LOADER
  // ======================================

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>
          Loading Dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#1E3A8A",
          }}
        >
          🚚 Golden Transport
        </Text>

        <View style={{ flexDirection: "row" }}>

  <TouchableOpacity
    onPress={() => router.push("/notifications")}
    activeOpacity={0.7}
  >
    <Ionicons
      name="notifications-outline"
      size={28}
      color="#1E3A8A"
    />
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => router.push("/profile")}
    activeOpacity={0.7}
    style={{ marginLeft: 18 }}
  >
    <Ionicons
      name="person-circle-outline"
      size={30}
      color="#1E3A8A"
    />
  </TouchableOpacity>

</View>
      </View>

      {driver ? (
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 18,
            padding: 20,
            marginBottom: 20,
            elevation: 5,
          }}
        >
          <Text
  style={{
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  }}
>
  👤 {driver.name}
</Text>

<Text
  style={{
    marginTop: 12,
    fontSize: 16,
    color: "#374151",
  }}
>
  📱 {driver.mobile}
</Text>

<Text
  style={{
    marginTop: 5,
    fontSize: 16,
    color: "#374151",
  }}
>
  🚚 {driver.vehicle_no}
</Text>

<Text
  style={{
    marginTop: 5,
    fontSize: 16,
    color: "#374151",
  }}
>
  🚛 {driver.vehicle_type}
</Text>

<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  }}
>
  <View
    style={{
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "#10B981",
      marginRight: 8,
    }}
  />
  <Text
    style={{
      color: "#10B981",
      fontWeight: "bold",
    }}
  >
    ONLINE
  </Text>
</View>

<Text
  style={{
    marginTop: 18,
    fontSize: 14,
    color: "#6B7280",
  }}
>
  Today&apos;s Earnings
</Text>

<Text
  style={{
    fontSize: 28,
    fontWeight: "bold",
    color: "#F59E0B",
  }}
>
  ₹{driver.earnings}
</Text>
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <Text
            style={{
              color: "#777",
            }}
          >
            Driver details not found
          </Text>
        </View>
      )}

      {/* Row 1 */}

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

      {/* Row 2 */}

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            router.push("/delivery-proof")
          }
        >
          <Text style={styles.actionText}>
            📷 Proof
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sosBtn}
          onPress={() =>
            router.push("/sos")
          }
        >
          <Text style={styles.actionText}>
            🚨 SOS
          </Text>
        </TouchableOpacity>
      </View>

      {/* Row 3 */}

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            router.push("/earnings")
          }
        >
          <Text style={styles.actionText}>
            💰 Earnings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => router.push("/settings")}
      >
        <Text style={styles.actionText}>
          ⚙️ Settings
        </Text>
      </TouchableOpacity>
      </View>

      {/* Row 4 */}

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            router.push("/trip-history")
          }
        >
          <Text style={styles.actionText}>
            📋 Trip History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutBtn}
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

      {trips.length > 0 ? (
        trips.map((trip) => (
          <View
            key={trip.trip_id}
            style={styles.tripCard}
          >
            <Text
              style={styles.tripTitle}
            >
              🚚 Trip #
              {trip.trip_id}
            </Text>

            <Text>
              📍 Pickup:
              {" "}
              {trip.pickup}
            </Text>

            <Text>
              🎯 Drop:
              {" "}
              {trip.drop}
            </Text>

            <Text>
              🚦 Status:
              {" "}
              <Text
                style={{
                  fontWeight:
                    "bold",
                }}
              >
                {trip.status}
              </Text>
            </Text>

            <View
              style={{
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={styles.blueBtn}
                onPress={() =>
                  updateStatus(
                    trip.trip_id,
                    "STARTED"
                  )
                }
              >
                <Text
                  style={
                    styles.btnText
                  }
                >
                  Start Trip
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.blueBtn}
                onPress={() =>
                  updateStatus(
                    trip.trip_id,
                    "REACHED_PICKUP"
                  )
                }
              >
                <Text
                  style={
                    styles.btnText
                  }
                >
                  Reached Pickup
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.blueBtn}
                onPress={() =>
                  updateStatus(
                    trip.trip_id,
                    "LOADED"
                  )
                }
              >
                <Text
                  style={
                    styles.btnText
                  }
                >
                  Loaded
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.blueBtn}
                onPress={() =>
                  updateStatus(
                    trip.trip_id,
                    "IN_TRANSIT"
                  )
                }
              >
                <Text
                  style={
                    styles.btnText
                  }
                >
                  In Transit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.greenBtn}
                onPress={() =>
                  updateStatus(
                    trip.trip_id,
                    "DELIVERED"
                  )
                }
              >
                <Text
                  style={
                    styles.btnText
                  }
                >
                  Delivered
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text
          style={{
            padding: 15,
            textAlign: "center",
            color: "#777",
          }}
        >
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
    marginBottom: 15,
    color: "#111",
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },

  driverName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  actionBtn: {
    backgroundColor: "#2563EB",
    width: "48%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  sosBtn: {
    backgroundColor: "#DC2626",
    width: "48%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutBtn: {
    backgroundColor: "#DC2626",
    width: "48%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  actionText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  tripCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },

  tripTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  blueBtn: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  greenBtn: {
    backgroundColor: "#16A34A",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  btnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});
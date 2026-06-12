import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function Notifications() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const driverId = await AsyncStorage.getItem("driver_id");
      if (!driverId) {
        Alert.alert("Error", "Driver ID not found");
        return;
      }

      const res = await API.get(`/driver/notifications/${driverId}`);
      if (res.data.status === "success") {
        setItems(res.data.notifications || []);
      }
    } catch (err) {
      console.log("Notification Error:", err);
      Alert.alert("Error", "Failed to load notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading Notifications...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>🔔 Notifications</Text>

      {items.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No Notifications Found</Text>
        </View>
      ) : (
        items.map((item: any) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.heading}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            {item.date && (
              <Text style={styles.date}>
                📅 {new Date(item.date).toLocaleString()}
              </Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F3F6FA",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    color: "#2563EB",
  },
  message: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: "#777",
    textAlign: "right",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

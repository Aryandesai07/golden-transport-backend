import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";

import API from "../services/api";

// ======================================
// TYPES
// ======================================

interface Payment {
  id: number;
  trip_id: number;
  amount: number;
  payment_date: string;
  status: string;
}

export default function Earnings() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  // ======================================
  // LOAD PAYMENTS
  // ======================================

  const loadPayments = async () => {
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

      const res = await API.get(
        `/driver/payments/${driverId}`
      );

      if (res.data.status === "success") {
        setPayments(res.data.payments || []);
      } else {
        setPayments([]);
      }

    } catch (error: any) {
      console.log(
        "Payment Error:",
        error
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Failed to load payments"
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ======================================
  // PULL TO REFRESH
  // ======================================

  const onRefresh = () => {
    setRefreshing(true);
    loadPayments();
  };

  // ======================================
  // TOTAL EARNINGS
  // ======================================

  const total = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  // ======================================
  // LOADER
  // ======================================

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />
        <Text>
          Loading Earnings...
        </Text>
      </View>
    );
  }

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
      <Text style={styles.heading}>
        💰 Driver Earnings
      </Text>

      {/* SUMMARY CARD */}

      <View style={styles.summary}>
        <Text style={styles.total}>
          ₹ {total.toFixed(2)}
        </Text>

        <Text style={styles.summaryText}>
          Total Earnings
        </Text>
      </View>

      {/* EMPTY STATE */}

      {payments.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No Payment Records Found
          </Text>

          <TouchableOpacity
            style={styles.retryBtn}
            onPress={loadPayments}
          >
            <Text style={styles.retryText}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        payments.map((item) => (
          <View
            key={item.id}
            style={styles.card}
          >
            <Text style={styles.trip}>
              🚚 Trip #{item.trip_id}
            </Text>

            <Text>
              💵 Amount: ₹{item.amount}
            </Text>

            <Text>
              📅 Date:{" "}
              {new Date(
                item.payment_date
              ).toLocaleDateString()}
            </Text>

            <Text>
              ✅ Status: {item.status}
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
    padding: 15,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },

  summary: {
    backgroundColor: "#2563EB",
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
  },

  total: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },

  summaryText: {
    color: "#FFFFFF",
    marginTop: 5,
    fontSize: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
  },

  trip: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },

  retryBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
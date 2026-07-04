import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

export default function NotificationsScreen() {
  const { theme } = useTheme();

  const [tripAlerts, setTripAlerts] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [locationAlerts, setLocationAlerts] = useState(true);
  const [promotions, setPromotions] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setTripAlerts(
      (await AsyncStorage.getItem("tripAlerts")) !== "false"
    );

    setOrderUpdates(
      (await AsyncStorage.getItem("orderUpdates")) !== "false"
    );

    setPaymentAlerts(
      (await AsyncStorage.getItem("paymentAlerts")) !== "false"
    );

    setLocationAlerts(
      (await AsyncStorage.getItem("locationAlerts")) !== "false"
    );

    setPromotions(
      (await AsyncStorage.getItem("promotions")) === "true"
    );
  };

  const save = async (
    key: string,
    value: boolean
  ) => {
    await AsyncStorage.setItem(
      key,
      value.toString()
    );
  };

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
      {/* HEADER */}

      <View style={styles.header}>
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
            styles.headerTitle,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Notifications
        </Text>

        <View style={{ width: 28 }} />
      </View>

      <NotificationItem
        title="Trip Alerts"
        subtitle="Receive notifications for assigned trips."
        value={tripAlerts}
        onChange={(value: boolean) => {
            setTripAlerts(value);
            save("tripAlerts", value);
        }}
        />

        <NotificationItem
        title="Order Updates"
        subtitle="Pickup & delivery updates."
        value={orderUpdates}
        onChange={(value: boolean) => {
            setOrderUpdates(value);
            save("orderUpdates", value);
        }}
        />

        <NotificationItem
        title="Payment Alerts"
        subtitle="Receive earnings and payment updates."
        value={paymentAlerts}
        onChange={(value: boolean) => {
            setPaymentAlerts(value);
            save("paymentAlerts", value);
        }}
        />

        <NotificationItem
        title="Live Location Alerts"
        subtitle="Notify when location sharing changes."
        value={locationAlerts}
        onChange={(value: boolean) => {
            setLocationAlerts(value);
            save("locationAlerts", value);
        }}
        />

        <NotificationItem
        title="Promotional Notifications"
        subtitle="Offers and company announcements."
        value={promotions}
        onChange={(value: boolean) => {
            setPromotions(value);
            save("promotions", value);
        }}
        />

      <View
        style={[
          styles.info,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="information-outline"
          size={22}
          color={theme.colors.primary}
        />

        <Text
          style={{
            flex: 1,
            marginLeft: 12,
            color: theme.colors.secondary,
            lineHeight: 22,
          }}
        >
          Notification preferences are automatically saved
          and applied the next time you use the application.
        </Text>
      </View>
    </ScrollView>
  );
}

function NotificationItem({
  title,
  subtitle,
  value,
  onChange,
}: any) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: theme.colors.text,
            fontWeight: "700",
            fontSize: 17,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: theme.colors.secondary,
            marginTop: 5,
          }}
        >
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: "#CBD5E1",
          true: theme.colors.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 15,
  },

  info: {
    flexDirection: "row",
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginTop: 20,
  },
});
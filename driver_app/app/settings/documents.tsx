import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

export default function DocumentsScreen() {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [driverName, setDriverName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const name =
      (await AsyncStorage.getItem("driver_name")) || "";

    setDriverName(name);

    setLoading(false);
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
            styles.title,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Documents
        </Text>

        <View style={{ width: 28 }} />
      </View>

      {/* Driver Card */}

      <View
        style={[
          styles.driverCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="account-circle"
          size={70}
          color={theme.colors.primary}
        />

        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: theme.colors.text,
            marginTop: 10,
          }}
        >
          {driverName}
        </Text>

        <Text
          style={{
            color: theme.colors.secondary,
            marginTop: 4,
          }}
        >
          Driver Documents
        </Text>
      </View>

      <DocumentCard
        icon="card-account-details"
        title="Driving Licence"
        status="Verified"
        color="#22C55E"
      />

      <DocumentCard
        icon="card-account-details-outline"
        title="Aadhaar Card"
        status="Verified"
        color="#22C55E"
      />

      <DocumentCard
        icon="credit-card-outline"
        title="PAN Card"
        status="Pending"
        color="#F59E0B"
      />

      <DocumentCard
        icon="truck"
        title="Vehicle RC Book"
        status="Verified"
        color="#22C55E"
      />

      <DocumentCard
        icon="shield-check"
        title="Vehicle Insurance"
        status="Valid"
        color="#22C55E"
      />

      <DocumentCard
        icon="leaf"
        title="PUC Certificate"
        status="Expires Soon"
        color="#EF4444"
      />

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="upload"
          size={22}
          color="white"
        />

        <Text style={styles.buttonText}>
          Upload Missing Documents
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function DocumentCard({
  icon,
  title,
  status,
  color,
}: any) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.documentCard,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={30}
        color={theme.colors.primary}
      />

      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text
          style={{
            fontWeight: "700",
            color: theme.colors.text,
            fontSize: 16,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color,
            marginTop: 4,
            fontWeight: "600",
          }}
        >
          {status}
        </Text>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={28}
        color={theme.colors.secondary}
      />
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

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  driverCard: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },

  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  button: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 10,
  },
});
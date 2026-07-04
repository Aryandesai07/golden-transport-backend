import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

interface Driver {
  id: number;
  name: string;
  mobile: string;
  vehicle_no: string;
  vehicle_type: string;
}

export default function ProfileScreen() {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState<Driver | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const driverData: Driver = {
        id: Number(await AsyncStorage.getItem("driver_id")) || 0,
        name: (await AsyncStorage.getItem("driver_name")) || "",
        mobile: (await AsyncStorage.getItem("driver_mobile")) || "",
        vehicle_no:
          (await AsyncStorage.getItem("vehicle_no")) || "",
        vehicle_type:
          (await AsyncStorage.getItem("vehicle_type")) || "",
      };

      setDriver(driverData);
    } finally {
      setLoading(false);
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
          Driver Profile
        </Text>

        <View style={{ width: 28 }} />
      </View>

      {/* PROFILE CARD */}

      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Image
          source={{
            uri:
              "https://ui-avatars.com/api/?background=2563EB&color=ffffff&size=256&name=" +
              encodeURIComponent(driver?.name || "Driver"),
          }}
          style={styles.avatar}
        />

        <Text
          style={[
            styles.name,
            {
              color: theme.colors.text,
            },
          ]}
        >
          {driver?.name}
        </Text>

        <Text
          style={{
            color: theme.colors.secondary,
            marginTop: 5,
          }}
        >
          Professional Driver
        </Text>
      </View>

      {/* DETAILS */}

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <ProfileRow
          icon="identifier"
          label="Driver ID"
          value={String(driver?.id)}
          theme={theme}
        />

        <ProfileRow
          icon="account"
          label="Full Name"
          value={driver?.name}
          theme={theme}
        />

        <ProfileRow
          icon="phone"
          label="Mobile Number"
          value={driver?.mobile}
          theme={theme}
        />

        <ProfileRow
          icon="truck"
          label="Vehicle Number"
          value={driver?.vehicle_no}
          theme={theme}
        />

        <ProfileRow
          icon="truck-fast"
          label="Vehicle Type"
          value={driver?.vehicle_type}
          theme={theme}
        />
      </View>

      {/* INFO */}

      <View
        style={[
          styles.infoCard,
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
            color: theme.colors.secondary,
            marginLeft: 12,
            flex: 1,
            lineHeight: 22,
          }}
        >
          Your profile information is managed by Golden
          Transport Administration. Contact the office if
          any information needs to be corrected.
        </Text>
      </View>
    </ScrollView>
  );
}

function ProfileRow({
  icon,
  label,
  value,
  theme,
}: any) {
  return (
    <View style={styles.row}>
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={theme.colors.primary}
      />

      <View style={{ marginLeft: 15 }}>
        <Text
          style={{
            color: theme.colors.secondary,
            fontSize: 13,
          }}
        >
          {label}
        </Text>

        <Text
          style={{
            color: theme.colors.text,
            fontWeight: "700",
            fontSize: 16,
            marginTop: 3,
          }}
        >
          {value || "-"}
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  profileCard: {
    alignItems: "center",
    padding: 25,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 20,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
  },

  name: {
    fontSize: 23,
    fontWeight: "700",
  },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  infoCard: {
    marginTop: 22,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    flexDirection: "row",
  },
});
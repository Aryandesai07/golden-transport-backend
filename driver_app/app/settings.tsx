import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import SettingItem from "../components/SettingItem";
import SettingSection from "../components/SettingSection";
import { useTheme } from "../context/ThemeContext";

interface Driver {
  id: number;
  name: string;
  mobile: string;
  vehicle_no: string;
  vehicle_type: string;
  earnings?: number;
}

export default function SettingsScreen() {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);

  const [driver, setDriver] =
    useState<Driver | null>(null);

  useEffect(() => {
    loadDriver();
  }, []);

  const loadDriver = async () => {
    try {
      const name =
        (await AsyncStorage.getItem(
          "driver_name"
        )) || "";

      const mobile =
        (await AsyncStorage.getItem(
          "driver_mobile"
        )) || "";

      const vehicle =
        (await AsyncStorage.getItem(
          "vehicle_no"
        )) || "";

      const vehicleType =
        (await AsyncStorage.getItem(
          "vehicle_type"
        )) || "";

      const driverId =
        Number(
          await AsyncStorage.getItem(
            "driver_id"
          )
        ) || 0;

      setDriver({
        id: driverId,
        name,
        mobile,
        vehicle_no: vehicle,
        vehicle_type: vehicleType,
      });
    } catch (e) {
      console.log(e);
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
            backgroundColor:
              theme.colors.background,
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
        backgroundColor:
          theme.colors.background,
      }}
      contentContainerStyle={{
        padding: 18,
        paddingBottom: 60,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <Text
        style={[
          styles.header,
          {
            color: theme.colors.text,
          },
        ]}
      >
        Settings
      </Text>

      {/* PROFILE CARD */}

      <View
        style={[
          styles.profileCard,
          {
            backgroundColor:
              theme.colors.card,
            borderColor:
              theme.colors.border,
          },
        ]}
      >
        <Image
          source={{
            uri:
              "https://ui-avatars.com/api/?name=" +
              (driver?.name || "Driver"),
          }}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.name,
              {
                color:
                  theme.colors.text,
              },
            ]}
          >
            {driver?.name || "Driver"}
          </Text>

          <Text
            style={[
              styles.mobile,
              {
                color:
                  theme.colors.secondary,
              },
            ]}
          >
            {driver?.mobile}
          </Text>

          <View
            style={styles.vehicleRow}
          >
            <MaterialCommunityIcons
              name="truck"
              size={18}
              color={
                theme.colors.primary
              }
            />

            <Text
              style={[
                styles.vehicle,
                {
                  color:
                    theme.colors.text,
                },
              ]}
            >
              {driver?.vehicle_no}
            </Text>
          </View>

          <Text
            style={{
              color:
                theme.colors.secondary,
            }}
          >
            {driver?.vehicle_type}
          </Text>
        </View>
      </View>

      {/* ACCOUNT */}

      <SettingSection title="Account">

        <SettingItem
          icon="account-circle"
          title="Profile"
          subtitle="View and edit profile"
        />

        <SettingItem
          icon="card-account-details"
          title="Documents"
          subtitle="Driving Licence, Aadhaar & PAN"
        />

        <SettingItem
          icon="truck"
          title="Vehicle Details"
          subtitle="Vehicle information"
        />

      </SettingSection>
            {/* PREFERENCES */}

      <SettingSection title="Preferences">

        <SettingItem
          icon="theme-light-dark"
          title="Appearance"
          subtitle="Light / Dark Mode"
          rightComponent={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          }
        />

        <SettingItem
          icon="bell-outline"
          title="Notifications"
          subtitle="Manage notification preferences"
          rightComponent={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          }
        />

        <SettingItem
          icon="crosshairs-gps"
          title="Live Location"
          subtitle="Location sharing settings"
          rightComponent={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          }
        />

        <SettingItem
          icon="translate"
          title="Language"
          subtitle="English"
          rightComponent={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          }
        />

      </SettingSection>

      {/* SECURITY */}

      <SettingSection title="Security">

        <SettingItem
          icon="lock-reset"
          title="Change Password"
          subtitle="Update your login password"
          rightComponent={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          }
        />

        <SettingItem
          icon="shield-check-outline"
          title="Privacy"
          subtitle="Privacy & security options"
          rightComponent={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          }
        />

      </SettingSection>
            {/* SUPPORT */}

      <SettingSection title="Support">

        <SettingItem
          icon="cellphone-arrow-down"
          title="Check for Updates"
          subtitle="Current Version 1.0.0"
          rightComponent={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          }
        />

        <SettingItem
          icon="star-outline"
          title="Rate App"
          subtitle="Rate Golden Transport"
          rightComponent={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          }
        />

        <SettingItem
          icon="share-variant"
          title="Share App"
          subtitle="Invite another driver"
          rightComponent={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          }
        />

        <SettingItem
          icon="lifebuoy"
          title="Contact Support"
          subtitle="Need help?"
          rightComponent={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          }
        />

      </SettingSection>

      {/* LEGAL */}

      <SettingSection title="Legal">

        <SettingItem
          icon="shield-account"
          title="Privacy Policy"
          subtitle="Read our privacy policy"
          rightComponent={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          }
        />

        <SettingItem
          icon="file-document-outline"
          title="Terms & Conditions"
          subtitle="Application terms"
          rightComponent={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          }
        />

        <SettingItem
          icon="information-outline"
          title="About Golden Transport"
          subtitle="Version 1.0.0"
          rightComponent={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          }
        />

      </SettingSection>

      {/* LOGOUT */}

      <View
        style={{
          marginTop: 35,
        }}
      >
        <SettingItem
          icon="logout"
          title="Logout"
          subtitle="Sign out from this device"
          iconColor="#EF4444"
          titleColor="#EF4444"
        />
      </View>

      {/* FOOTER */}

      <Text
        style={{
          textAlign: "center",
          marginTop: 40,
          marginBottom: 25,
          color: theme.colors.secondary,
          fontSize: 13,
        }}
      >
        Golden Transport Driver App
      </Text>

      <Text
        style={{
          textAlign: "center",
          color: theme.colors.secondary,
          fontSize: 12,
        }}
      >
        Version 1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
  fontSize: 30,
  fontWeight: "bold",
  marginBottom: 20,
},

profileCard: {
  flexDirection: "row",
  alignItems: "center",
  padding: 18,
  borderRadius: 20,
  borderWidth: 1,
  marginBottom: 25,
},

avatar: {
  width: 80,
  height: 80,
  borderRadius: 40,
  marginRight: 18,
},

name: {
  fontSize: 22,
  fontWeight: "700",
},

mobile: {
  fontSize: 15,
  marginTop: 4,
},

vehicleRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 10,
},

vehicle: {
  marginLeft: 8,
  fontSize: 15,
  fontWeight: "600",
},
});
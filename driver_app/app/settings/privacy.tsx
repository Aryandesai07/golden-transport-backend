import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";

export default function PrivacyScreen() {
  const { theme } = useTheme();

  const [analytics, setAnalytics] = useState(false);
  const [crashReports, setCrashReports] = useState(true);
  const [locationHistory, setLocationHistory] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setAnalytics(
      (await AsyncStorage.getItem("privacyAnalytics")) === "true"
    );

    setCrashReports(
      (await AsyncStorage.getItem("privacyCrash")) !== "false"
    );

    setLocationHistory(
      (await AsyncStorage.getItem("privacyLocation")) !== "false"
    );
  }

  async function save(key: string, value: boolean) {
    await AsyncStorage.setItem(key, value.toString());
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="shield-lock"
          size={70}
          color={theme.colors.primary}
        />

        <Text
          style={[
            styles.title,
            { color: theme.colors.text },
          ]}
        >
          Privacy & Security
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: theme.colors.secondary },
          ]}
        >
          Manage your privacy preferences.
        </Text>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <SettingRow
  title="Usage Analytics"
  subtitle="Help improve the application."
  value={analytics}
  onValueChange={(v: boolean) => {
    setAnalytics(v);
    save("privacyAnalytics", v);
  }}
  theme={theme}
/>

<SettingRow
  title="Crash Reports"
  subtitle="Automatically send crash reports."
  value={crashReports}
  onValueChange={(v: boolean) => {
    setCrashReports(v);
    save("privacyCrash", v);
  }}
  theme={theme}
/>

<SettingRow
  title="Location History"
  subtitle="Store previous location history."
  value={locationHistory}
  onValueChange={(v: boolean) => {
    setLocationHistory(v);
    save("privacyLocation", v);
  }}
  theme={theme}
/>
      </View>

      <View
        style={[
          styles.infoCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.infoTitle,
            { color: theme.colors.text },
          ]}
        >
          Your Privacy
        </Text>

        <Text
          style={[
            styles.infoText,
            { color: theme.colors.secondary },
          ]}
        >
          Golden Transport collects only the information required for
          trip management, driver verification, live tracking and
          delivery operations. Your personal information is securely
          stored and never shared with third parties without
          authorization.
        </Text>
      </View>
    </ScrollView>
  );
}

function SettingRow({
  title,
  subtitle,
  value,
  onValueChange,
  theme,
}: any) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.rowTitle,
            { color: theme.colors.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.rowSubtitle,
            { color: theme.colors.secondary },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: "#767577",
          true: theme.colors.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 15,
  },

  subtitle: {
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },

  rowTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  rowSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },

  infoCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  infoText: {
    fontSize: 15,
    lineHeight: 24,
  },
});
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";

export default function UpdatesScreen() {
  const { theme } = useTheme();

  function checkUpdates() {
    Alert.alert(
      "You're Up To Date",
      "Golden Transport Driver is running the latest version."
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={styles.back}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={28}
          color={theme.colors.primary}
        />
      </TouchableOpacity>

      <MaterialCommunityIcons
        name="cellphone-arrow-down"
        size={90}
        color={theme.colors.primary}
      />

      <Text
        style={[
          styles.title,
          { color: theme.colors.text },
        ]}
      >
        Check for Updates
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.secondary },
        ]}
      >
        Keep your application updated for the best performance and latest features.
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Row
          title="Current Version"
          value="1.0.0"
          theme={theme}
        />

        <Row
          title="Build Number"
          value="100"
          theme={theme}
        />

        <Row
          title="Release Channel"
          value="Production"
          theme={theme}
        />

        <Row
          title="Status"
          value="Latest Version"
          theme={theme}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
        onPress={checkUpdates}
      >
        <MaterialCommunityIcons
          name="update"
          color="#fff"
          size={22}
        />

        <Text style={styles.buttonText}>
          Check Now
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({
  title,
  value,
  theme,
}: any) {
  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.rowTitle,
          { color: theme.colors.secondary },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.rowValue,
          { color: theme.colors.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
    alignItems: "center",
  },

  back: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
  },

  subtitle: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    fontSize: 15,
    lineHeight: 22,
  },

  card: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 30,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
  },

  rowTitle: {
    fontSize: 15,
  },

  rowValue: {
    fontSize: 15,
    fontWeight: "700",
  },

  button: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 15,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 10,
  },
});
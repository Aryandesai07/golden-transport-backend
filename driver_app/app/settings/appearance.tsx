import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";

import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";

export default function AppearanceScreen() {
  const {
    theme,
    darkMode,
    toggleTheme,
  } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
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
          Appearance
        </Text>

        <View style={{ width: 28 }} />
      </View>

      {/* THEME CARD */}

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              theme.colors.card,
            borderColor:
              theme.colors.border,
          },
        ]}
      >
        <View style={styles.row}>
          <MaterialCommunityIcons
            name={
              darkMode
                ? "weather-night"
                : "white-balance-sunny"
            }
            size={34}
            color={theme.colors.primary}
          />

          <View
            style={{
              flex: 1,
              marginLeft: 18,
            }}
          >
            <Text
              style={[
                styles.title,
                {
                  color:
                    theme.colors.text,
                },
              ]}
            >
              Dark Mode
            </Text>

            <Text
              style={{
                color:
                  theme.colors.secondary,
                marginTop: 4,
              }}
            >
              Switch between Light and
              Dark theme.
            </Text>
          </View>

          <Switch
            value={darkMode}
            onValueChange={toggleTheme}
            trackColor={{
              false: "#CBD5E1",
              true: theme.colors.primary,
            }}
          />
        </View>
      </View>

      {/* PREVIEW */}

      <Text
        style={[
          styles.previewTitle,
          {
            color: theme.colors.text,
          },
        ]}
      >
        Theme Preview
      </Text>

      <View
        style={[
          styles.preview,
          {
            backgroundColor:
              theme.colors.card,
            borderColor:
              theme.colors.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="palette"
          size={50}
          color={theme.colors.primary}
        />

        <Text
          style={[
            styles.previewText,
            {
              color:
                theme.colors.text,
            },
          ]}
        >
          Golden Tamilnadu Transport
        </Text>

        <Text
          style={{
            color:
              theme.colors.secondary,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Your selected appearance
          will be applied throughout
          the application.
        </Text>
      </View>

      {/* INFO */}

      <View
        style={[
          styles.info,
          {
            backgroundColor:
              theme.colors.card,
            borderColor:
              theme.colors.border,
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
            color:
              theme.colors.secondary,
            lineHeight: 22,
          }}
        >
          Theme preference is saved
          automatically and restored
          every time you open the app.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  previewTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 35,
    marginBottom: 15,
  },

  preview: {
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    padding: 30,
  },

  previewText: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: "700",
  },

  info: {
    flexDirection: "row",
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginTop: 35,
    alignItems: "flex-start",
  },
});
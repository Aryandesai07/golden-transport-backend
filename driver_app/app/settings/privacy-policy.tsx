import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";

export default function PrivacyPolicyScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={28}
          color={theme.colors.primary}
        />
      </TouchableOpacity>

      <MaterialCommunityIcons
        name="shield-account"
        size={90}
        color={theme.colors.primary}
      />

      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
          },
        ]}
      >
        Privacy Policy
      </Text>

      <Text
        style={[
          styles.lastUpdated,
          {
            color: theme.colors.secondary,
          },
        ]}
      >
        Last Updated: July 2026
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
        <Section
          title="1. Information We Collect"
          text="Golden Transport collects driver information including your name, mobile number, vehicle details, trip records, and live location only when required for transport operations."
          theme={theme}
        />

        <Section
          title="2. Location Data"
          text="Live location is collected only while performing assigned deliveries to improve customer tracking and fleet management."
          theme={theme}
        />

        <Section
          title="3. Data Security"
          text="Your personal information is securely stored using encrypted communication between the mobile application and our servers."
          theme={theme}
        />

        <Section
          title="4. Data Sharing"
          text="Golden Transport never sells or shares your personal information with third parties except where required by law or company operations."
          theme={theme}
        />

        <Section
          title="5. Driver Responsibilities"
          text="Drivers are responsible for protecting their login credentials and immediately reporting any unauthorized access."
          theme={theme}
        />

        <Section
          title="6. Policy Updates"
          text="This Privacy Policy may be updated periodically. Continued use of the application indicates acceptance of the latest policy."
          theme={theme}
        />
      </View>

      <Text
        style={[
          styles.footer,
          {
            color: theme.colors.secondary,
          },
        ]}
      >
        © 2026 Golden Transport. All Rights Reserved.
      </Text>
    </ScrollView>
  );
}

function Section({
  title,
  text,
  theme,
}: any) {
  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: theme.colors.text,
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.sectionText,
          {
            color: theme.colors.secondary,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
    paddingBottom: 40,
  },

  backButton: {
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 15,
  },

  lastUpdated: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
    fontSize: 14,
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  sectionText: {
    fontSize: 15,
    lineHeight: 24,
  },

  footer: {
    textAlign: "center",
    marginTop: 35,
    fontSize: 13,
  },
});
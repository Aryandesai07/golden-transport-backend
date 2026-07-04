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

export default function TermsScreen() {
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
        name="file-document-outline"
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
        Terms & Conditions
      </Text>

      <Text
        style={[
          styles.updated,
          {
            color: theme.colors.secondary,
          },
        ]}
      >
        Effective Date: July 2026
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
          title="1. Driver Account"
          text="Drivers must register using valid personal information. Sharing login credentials with others is strictly prohibited."
          theme={theme}
        />

        <Section
          title="2. Vehicle Responsibility"
          text="Drivers are responsible for maintaining valid vehicle documents, insurance, permits and fitness certificates."
          theme={theme}
        />

        <Section
          title="3. Delivery Responsibilities"
          text="Drivers must deliver goods safely, follow assigned routes, and update delivery status accurately."
          theme={theme}
        />

        <Section
          title="4. Application Usage"
          text="The application must only be used for official Golden Transport operations. Unauthorized use is prohibited."
          theme={theme}
        />

        <Section
          title="5. Location Tracking"
          text="Drivers agree to share live location while assigned to active trips for operational monitoring."
          theme={theme}
        />

        <Section
          title="6. Suspension"
          text="Golden Transport reserves the right to suspend or terminate any account involved in misuse, fraud, or policy violations."
          theme={theme}
        />

        <Section
          title="7. Limitation of Liability"
          text="Golden Transport shall not be liable for losses caused by incorrect information entered by drivers or misuse of the application."
          theme={theme}
        />

        <Section
          title="8. Acceptance"
          text="By using this application, you agree to comply with these Terms & Conditions."
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

  updated: {
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
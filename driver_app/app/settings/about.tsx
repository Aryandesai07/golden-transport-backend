import React from "react";
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const About = () => {
  const { theme } = useTheme();

  const openEmail = () => {
    Linking.openURL("mailto:shounandhgounder11@gmail.com");
  };

  const callOwner = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* HEADER */}
      <View style={[styles.headerCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.appName, { color: theme.colors.text }]}>
          Golden Tamilnadu Transport
        </Text>

        <Text style={[styles.tagline, { color: theme.colors.secondary }]}>
          Driver Portal for Load Management & Logistics Operations
        </Text>

        <Text style={[styles.version, { color: theme.colors.secondary }]}>
          Build Version: 7
        </Text>
      </View>

      {/* COMPANY INFO */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Company Information
        </Text>

        <Text style={[styles.text, { color: theme.colors.text }]}>
          Golden Tamilnadu Transport is a logistics and transport coordination system
          connecting truck owners, drivers, and load providers across India.
        </Text>

        <Text style={[styles.text, { color: theme.colors.text }]}>
          Operations are mainly active in Maharashtra, Gujarat, Karnataka, and
          Kolhapur region for load distribution and truck availability matching.
        </Text>
      </View>

      {/* OWNERS */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Management & Owners
        </Text>

        <Text style={[styles.text, { color: theme.colors.text }]}>
          Primary Owner: Shonandh Sadashivam Gounder
        </Text>

        <TouchableOpacity onPress={() => callOwner("6380779371")}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>
            📞 6380779371 (Tap to call)
          </Text>
        </TouchableOpacity>

        <Text style={[styles.text, { color: theme.colors.text, marginTop: 10 }]}>
          Co-Owner / Developer: Prasanna Satish Desai
        </Text>

        <TouchableOpacity onPress={() => callOwner("9284926533")}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>
            📞 9284926533 (Tap to call)
          </Text>
        </TouchableOpacity>
      </View>

      {/* FEATURES */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Key Features
        </Text>

        {[
          "Driver trip & load tracking system",
          "Live available load listings",
          "Fuel bill & expense management",
          "Document storage (License, RC, Insurance)",
          "Trip history & proof management",
          "Location-based load matching",
          "Secure driver login system",
          "Dark & Light theme support",
        ].map((item, index) => (
          <Text key={index} style={[styles.bullet, { color: theme.colors.text }]}>
            • {item}
          </Text>
        ))}
      </View>

      {/* SUPPORT */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Support
        </Text>

        <TouchableOpacity onPress={openEmail}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>
            📧 shounandhgounder11@gmail.com
          </Text>
        </TouchableOpacity>
      </View>

      {/* LEGAL */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Legal
        </Text>

        <Text style={[styles.text, { color: theme.colors.text }]}>
          This application is used for internal logistics operations, driver
          coordination, and transport management only. All data is securely handled
          within the system.
        </Text>
      </View>
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: "700",
  },
  tagline: {
    fontSize: 13,
    marginTop: 6,
  },
  version: {
    fontSize: 12,
    marginTop: 6,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  text: {
    fontSize: 13,
    lineHeight: 20,
  },
  bullet: {
    fontSize: 13,
    marginTop: 6,
  },
  link: {
    fontSize: 13,
    marginTop: 6,
    fontWeight: "600",
  },
});
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";

import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";

export default function ContactSupportScreen() {
  const { theme } = useTheme();

  const PHONE = "+919876543210";
  const EMAIL = "support@goldentransport.com";
  const WHATSAPP = "919876543210";

  const openPhone = async () => {
    const url = `tel:${PHONE}`;

    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    } else {
      Alert.alert("Error", "Unable to make a phone call.");
    }
  };

  const openEmail = async () => {
    const url = `mailto:${EMAIL}`;

    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    } else {
      Alert.alert("Error", "Unable to open email.");
    }
  };

  const openWhatsApp = async () => {
    const url = `https://wa.me/${WHATSAPP}`;

    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    } else {
      Alert.alert("Error", "WhatsApp is not installed.");
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.back}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={28}
          color={theme.colors.primary}
        />
      </TouchableOpacity>

      <MaterialCommunityIcons
        name="lifebuoy"
        size={90}
        color={theme.colors.primary}
      />

      <Text
        style={[
          styles.title,
          { color: theme.colors.text },
        ]}
      >
        Contact Support
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.secondary },
        ]}
      >
        We&apos;re here to help you 24×7.
      </Text>

      <SupportCard
        icon="phone"
        title="Call Support"
        value={PHONE}
        onPress={openPhone}
        theme={theme}
      />

      <SupportCard
        icon="email"
        title="Email Support"
        value={EMAIL}
        onPress={openEmail}
        theme={theme}
      />

      <SupportCard
        icon="whatsapp"
        title="WhatsApp"
        value="+91 9876543210"
        onPress={openWhatsApp}
        theme={theme}
      />

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
          Office Address
        </Text>

        <Text
          style={[
            styles.infoText,
            { color: theme.colors.secondary },
          ]}
        >
          Golden Transport Pvt. Ltd.

          {"\n\n"}

          Sangli, Maharashtra

          {"\n"}

          India

          {"\n\n"}

          Monday - Saturday

          {"\n"}

          9:00 AM - 6:00 PM
        </Text>
      </View>
    </ScrollView>
  );
}

function SupportCard({
  icon,
  title,
  value,
  onPress,
  theme,
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={28}
        color={theme.colors.primary}
      />

      <View style={{ marginLeft: 18 }}>
        <Text
          style={[
            styles.cardTitle,
            {
              color: theme.colors.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.cardValue,
            {
              color: theme.colors.secondary,
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
    paddingBottom: 40,
  },

  back: {
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 15,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 10,
    marginBottom: 30,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  cardValue: {
    marginTop: 5,
    fontSize: 15,
  },

  infoCard: {
    marginTop: 20,
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  infoText: {
    fontSize: 15,
    lineHeight: 25,
  },
});
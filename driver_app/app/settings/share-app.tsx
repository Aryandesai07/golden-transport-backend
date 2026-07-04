import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
} from "react-native";

import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";

export default function ShareAppScreen() {
  const { theme } = useTheme();

  async function shareApp() {
    try {
      await Share.share({
        title: "Golden Transport Driver",
        message:
          "🚚 Golden Transport Driver App\n\nManage trips, deliveries and earnings with the Golden Transport Driver App.\n\nDownload the app from:\nhttps://your-app-link.com",
      });
    } catch {
      Alert.alert(
        "Error",
        "Unable to share the application."
      );
    }
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
        name="share-variant"
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
        Share App
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: theme.colors.secondary,
          },
        ]}
      >
        Invite other drivers to use the Golden Transport Driver App.
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
        <Text
          style={[
            styles.cardTitle,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Why Share?
        </Text>

        <Text
          style={[
            styles.cardText,
            {
              color: theme.colors.secondary,
            },
          ]}
        >
          • Quick driver registration{"\n"}
          • Live trip management{"\n"}
          • Delivery proof upload{"\n"}
          • Real-time notifications{"\n"}
          • Secure login{"\n"}
          • Track earnings
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
        onPress={shareApp}
      >
        <MaterialCommunityIcons
          name="share"
          size={22}
          color="#FFFFFF"
        />

        <Text style={styles.buttonText}>
          Share Now
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
  },

  backButton: {
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
    fontSize: 15,
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 22,
  },

  card: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    marginBottom: 30,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  cardText: {
    fontSize: 15,
    lineHeight: 28,
  },

  button: {
    width: "100%",
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 10,
  },
});
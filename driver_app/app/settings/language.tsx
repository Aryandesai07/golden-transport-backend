import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";

const languages = [
  {
    code: "en",
    name: "English",
    subtitle: "Default Language",
  },
  {
    code: "hi",
    name: "Hindi",
    subtitle: "हिन्दी",
  },
  {
    code: "mr",
    name: "Marathi",
    subtitle: "मराठी",
  },
  {
    code: "ta",
    name: "Tamil",
    subtitle: "தமிழ்",
  },
];

export default function LanguageScreen() {
  const { theme } = useTheme();

  const [selected, setSelected] = useState("en");

  useEffect(() => {
    loadLanguage();
  }, []);

  async function loadLanguage() {
    const value =
      (await AsyncStorage.getItem("language")) ||
      "en";

    setSelected(value);
  }

  async function selectLanguage(code: string) {
    setSelected(code);

    await AsyncStorage.setItem(
      "language",
      code
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
        padding: 20,
        paddingBottom: 40,
      }}
    >
      <TouchableOpacity
        style={styles.back}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={26}
          color={theme.colors.primary}
        />

        <Text
          style={[
            styles.backText,
            {
              color: theme.colors.primary,
            },
          ]}
        >
          Back
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
          },
        ]}
      >
        Language
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: theme.colors.secondary,
          },
        ]}
      >
        Select your preferred application language.
      </Text>

      {languages.map((item) => (
        <TouchableOpacity
          key={item.code}
          activeOpacity={0.85}
          onPress={() =>
            selectLanguage(item.code)
          }
          style={[
            styles.card,
            {
              backgroundColor:
                theme.colors.card,
              borderColor:
                selected === item.code
                  ? theme.colors.primary
                  : theme.colors.border,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.language,
                {
                  color:
                    theme.colors.text,
                },
              ]}
            >
              {item.name}
            </Text>

            <Text
              style={{
                color:
                  theme.colors.secondary,
                marginTop: 4,
              }}
            >
              {item.subtitle}
            </Text>
          </View>

          {selected === item.code && (
            <MaterialCommunityIcons
              name="check-circle"
              size={28}
              color={theme.colors.success}
            />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  backText: {
    marginLeft: 8,
    fontSize: 17,
    fontWeight: "700",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 30,
    fontSize: 15,
    lineHeight: 22,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 15,
  },

  language: {
    fontSize: 18,
    fontWeight: "700",
  },
});
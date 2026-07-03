import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function SettingSection({
  title,
  children,
}: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.secondary,
          },
        ]}
      >
        {title.toUpperCase()}
      </Text>

      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },

  title: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 1,
  },
});
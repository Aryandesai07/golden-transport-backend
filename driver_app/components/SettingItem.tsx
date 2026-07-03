import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface Props {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;

  onPress?: () => void;

  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;

  danger?: boolean;

  // NEW
  rightComponent?: React.ReactNode;
  iconColor?: string;
  titleColor?: string;
}

export default function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  danger = false,
}: Props) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={showSwitch}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.left}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={
            danger
              ? theme.colors.danger
              : theme.colors.primary
          }
        />

        <View style={{ marginLeft: 15 }}>
          <Text
            style={[
              styles.title,
              {
                color: danger
                  ? theme.colors.danger
                  : theme.colors.text,
              },
            ]}
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color:
                    theme.colors.secondary,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{
            false: "#767577",
            true: theme.colors.primary,
          }}
        />
      ) : (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={theme.colors.secondary}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    padding: 16,
    marginBottom: 12,

    borderRadius: 18,
    borderWidth: 1,

    elevation: 3,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
  },
  
});
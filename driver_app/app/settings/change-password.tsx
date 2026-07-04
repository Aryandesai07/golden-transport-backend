import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";

export default function ChangePasswordScreen() {
  const { theme } = useTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const savePassword = () => {
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill all fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "New password and confirmation do not match."
      );
      return;
    }

    Alert.alert(
      "Success",
      "Password updated successfully."
    );

    router.back();
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
        style={styles.backButton}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={28}
          color={theme.colors.primary}
        />
      </TouchableOpacity>

      <MaterialCommunityIcons
        name="lock-reset"
        size={80}
        color={theme.colors.primary}
      />

      <Text
        style={[
          styles.title,
          { color: theme.colors.text },
        ]}
      >
        Change Password
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.secondary },
        ]}
      >
        Keep your account secure by updating your password.
      </Text>

      <TextInput
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholderTextColor={theme.colors.secondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
      />

      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholderTextColor={theme.colors.secondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor={theme.colors.secondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
      />

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
        onPress={savePassword}
      >
        <Text style={styles.buttonText}>
          Update Password
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    alignItems: "center",
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 15,
  },

  subtitle: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    fontSize: 15,
    lineHeight: 22,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 14,
    padding: 15,
    marginBottom: 18,
    fontSize: 16,
  },

  button: {
    width: "100%",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
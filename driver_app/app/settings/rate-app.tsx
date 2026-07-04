import React, { useState } from "react";
import {
  View,
 Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

export default function RateAppScreen() {
  const { theme } = useTheme();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const submitRating = () => {
    if (rating === 0) {
      Alert.alert(
        "Rating Required",
        "Please select a star rating."
      );
      return;
    }

    Alert.alert(
      "Thank You!",
      "Your feedback has been submitted successfully."
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
        name="star-circle"
        size={90}
        color="#F59E0B"
      />

      <Text
        style={[
          styles.title,
          { color: theme.colors.text },
        ]}
      >
        Rate Golden Transport
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.secondary },
        ]}
      >
        Your feedback helps us improve the Driver App.
      </Text>

      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
          >
            <MaterialCommunityIcons
              name={
                rating >= star
                  ? "star"
                  : "star-outline"
              }
              size={42}
              color="#F59E0B"
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        multiline
        numberOfLines={5}
        value={feedback}
        onChangeText={setFeedback}
        placeholder="Write your feedback..."
        placeholderTextColor={
          theme.colors.secondary
        }
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
            backgroundColor:
              theme.colors.primary,
          },
        ]}
        onPress={submitRating}
      >
        <MaterialCommunityIcons
          name="send"
          size={22}
          color="#fff"
        />

        <Text style={styles.buttonText}>
          Submit Feedback
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
    marginTop: 10,
    marginBottom: 35,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
  },

  starContainer: {
    flexDirection: "row",
    marginBottom: 35,
  },

  star: {
    marginHorizontal: 5,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    minHeight: 140,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 25,
  },

  button: {
    width: "100%",
    padding: 16,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    marginLeft: 10,
  },
});
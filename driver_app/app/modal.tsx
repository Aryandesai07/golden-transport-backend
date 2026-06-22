import { Link } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">This is a modal</ThemedText>

      {/* Link back to home */}
      <Link href="/" asChild>
        <ThemedText type="link" style={styles.link}>
          Go to home screen
        </ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F3F6FA", // optional background for consistency
  },
  link: {
    marginTop: 20,
    paddingVertical: 12,
    color: "#2563EB",
    fontWeight: "bold",
  },
});

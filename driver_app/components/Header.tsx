import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Ionicons name="bus" size={32} color="#F59E0B" />
        <Text style={styles.title}>Golden Transport</Text>
      </View>

      <View style={styles.right}>
        <Ionicons
          name="notifications-outline"
          size={26}
          color="#1E3A8A"
        />

        <Ionicons
          name="person-circle-outline"
          size={34}
          color="#1E3A8A"
          style={{ marginLeft: 15 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 10,
    color: "#111827",
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
  },
});
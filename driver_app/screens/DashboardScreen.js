import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Dashboard() {

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        🚚 Golden Transport
      </Text>

      <Text style={styles.subtitle}>
        Driver Dashboard
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  title: {
    fontSize: 30,
    fontWeight: "bold"
  },

  subtitle: {
    fontSize: 18,
    marginTop: 15
  }

});
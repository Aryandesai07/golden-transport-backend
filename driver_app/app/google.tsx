import React from "react";
import { View, Button, Alert } from "react-native";

export default function GoogleTest() {
  const test = async () => {
    try {
      const res = await fetch("https://www.google.com");

      Alert.alert("SUCCESS", String(res.status));
    } catch (e) {
      console.log(e);
      Alert.alert("ERROR", String(e));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button title="Test Google" onPress={test} />
    </View>
  );
}
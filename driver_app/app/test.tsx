import React from "react";
import { View, Button, Alert } from "react-native";

export default function TestAPI() {
  const test = async () => {
    try {
      const res = await fetch(
        "https://golden-transport-backend-production.up.railway.app/ping",
        {
          method: "POST",
        }
      );

      const text = await res.text();

      console.log(text);

      Alert.alert("SUCCESS", text);
    } catch (e) {
      console.log(e);
      Alert.alert("ERROR", String(e));
    }
  };

  return (
    <View style={{ flex:1, justifyContent:"center" }}>
      <Button title="Test POST" onPress={test}/>
    </View>
  );
}
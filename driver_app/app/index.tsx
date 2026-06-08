import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import LoginScreen from "../screens/LoginScreen";

export default function Index() {

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {

    const token =
      await AsyncStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
    }
  };

  return <LoginScreen />;
}
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  DarkTheme,
  LightTheme,
} from "../utils/theme";

type ThemeType = typeof LightTheme;

interface ThemeContextType {
  theme: ThemeType;
  darkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext =
  createContext<ThemeContextType>(
    {} as ThemeContextType
  );

export const ThemeProvider = ({
  children,
}: any) => {
  const [darkMode, setDarkMode] =
    useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const saved =
      await AsyncStorage.getItem(
        "darkMode"
      );

    if (saved === "true") {
      setDarkMode(true);
    }
  };

  const toggleTheme = async () => {
    const value = !darkMode;

    setDarkMode(value);

    await AsyncStorage.setItem(
      "darkMode",
      value.toString()
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
        theme: darkMode
          ? DarkTheme
          : LightTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () =>
  useContext(ThemeContext);
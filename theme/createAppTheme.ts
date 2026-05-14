import type { ColorSchemeName } from "react-native";

import { borderRadius, layout, spacing, typography } from "./tokens";

export type ThemeMode = "light" | "dark";

export type AppTheme = {
  mode: ThemeMode;
  colorScheme: NonNullable<ColorSchemeName>;
  colors: {
    background: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textInverse: string;
    primary: string;
    primaryOn: string;
    danger: string;
    success: string;
    warning: string;
    overlay: string;
    tabBar: string;
    tabBarBorder: string;
    inputBackground: string;
    inputBorder: string;
    link: string;
  };
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  layout: typeof layout;
};

const lightColors: AppTheme["colors"] = {
  background: "#F4F6F8",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",
  border: "#D7DEE6",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textInverse: "#FFFFFF",
  primary: "#208AEF",
  primaryOn: "#FFFFFF",
  danger: "#DC2626",
  success: "#16A34A",
  warning: "#D97706",
  overlay: "rgba(15, 23, 42, 0.45)",
  tabBar: "#FFFFFF",
  tabBarBorder: "#E2E8F0",
  inputBackground: "#FFFFFF",
  inputBorder: "#CBD5E1",
  link: "#1D4ED8",
};

const darkColors: AppTheme["colors"] = {
  background: "#0B1220",
  surface: "#111827",
  surfaceElevated: "#1F2937",
  border: "#334155",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textInverse: "#0F172A",
  primary: "#38BDF8",
  primaryOn: "#0F172A",
  danger: "#F87171",
  success: "#4ADE80",
  warning: "#FBBF24",
  overlay: "rgba(2, 6, 23, 0.65)",
  tabBar: "#0F172A",
  tabBarBorder: "#1E293B",
  inputBackground: "#0F172A",
  inputBorder: "#334155",
  link: "#93C5FD",
};

export function createAppTheme(mode: ThemeMode): AppTheme {
  const colors = mode === "light" ? lightColors : darkColors;
  return {
    mode,
    colorScheme: mode === "light" ? "light" : "dark",
    colors,
    spacing,
    borderRadius,
    typography,
    layout,
  };
}

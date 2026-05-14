import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance, useColorScheme } from "react-native";

import { STORAGE_KEY_THEME_PREFERENCE } from "@/constants/storageKeys";

import { type AppTheme, createAppTheme, type ThemeMode } from "./createAppTheme";

export type ThemePreference = ThemeMode | "system";

type ThemeContextValue = {
  theme: AppTheme;
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => Promise<void>;
  resolvedMode: ThemeMode;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveSystemMode(system: ReturnType<typeof useColorScheme>): ThemeMode {
  return system === "dark" ? "dark" : "light";
}

type ThemeProviderProps = {
  children: ReactNode;
  initialPreference?: ThemePreference;
};

export function ThemeProvider({ children, initialPreference = "system" }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(initialPreference);

  useEffect(() => {
    if (initialPreference === "system") {
      Appearance.setColorScheme("unspecified");
      return;
    }
    Appearance.setColorScheme(initialPreference);
  }, [initialPreference]);

  const resolvedMode: ThemeMode =
    preference === "system" ? resolveSystemMode(systemScheme) : preference;

  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode]);

  const setPreference = useCallback(async (value: ThemePreference) => {
    setPreferenceState(value);
    await AsyncStorage.setItem(STORAGE_KEY_THEME_PREFERENCE, value);
    if (value !== "system") {
      Appearance.setColorScheme(value);
      return;
    }
    Appearance.setColorScheme("unspecified");
  }, []);

  const value = useMemo(
    () => ({
      theme,
      preference,
      setPreference,
      resolvedMode,
    }),
    [preference, resolvedMode, setPreference, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider.");
  }
  return ctx;
}

export async function readStoredThemePreference(): Promise<ThemePreference> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY_THEME_PREFERENCE);
  if (raw === "light" || raw === "dark" || raw === "system") {
    return raw;
  }
  return "system";
}

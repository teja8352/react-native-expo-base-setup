import { useMemo } from "react";
import type { StyleSheet } from "react-native";

import type { AppTheme } from "./createAppTheme";
import { useThemeContext } from "./ThemeProvider";

export function useAppTheme(): AppTheme {
  return useThemeContext().theme;
}

export function useThemedStyles<
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<unknown>,
>(factory: (theme: AppTheme) => T): T {
  const { theme } = useThemeContext();
  return useMemo(() => factory(theme), [factory, theme]);
}

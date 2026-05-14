import { StyleSheet } from "react-native";
import type { AppTheme } from "theme/createAppTheme";

export function createTab3HomeScreenStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: {
      gap: theme.spacing.sm,
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    body: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textSecondary,
    },
  });
}

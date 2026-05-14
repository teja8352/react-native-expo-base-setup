import { StyleSheet } from "react-native";
import type { AppTheme } from "theme/createAppTheme";
import { layout } from "theme/tokens";

export function createModalScreenStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: {
      gap: theme.spacing.md,
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
    button: {
      minHeight: layout.touchTargetMin,
      borderRadius: theme.borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
    },
    buttonLabel: {
      color: theme.colors.primaryOn,
      fontSize: theme.typography.fontSize.md,
      fontWeight: "600",
    },
  });
}

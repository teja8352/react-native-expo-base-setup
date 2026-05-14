import { StyleSheet } from "react-native";
import type { AppTheme } from "theme/createAppTheme";

export function createLoginScreenStyles(theme: AppTheme) {
  return StyleSheet.create({
    header: {
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: "700",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    formError: {
      color: theme.colors.danger,
      marginBottom: theme.spacing.sm,
    },
    links: {
      marginTop: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    link: {
      color: theme.colors.link,
      fontSize: theme.typography.fontSize.md,
      paddingVertical: theme.spacing.xs,
    },
  });
}

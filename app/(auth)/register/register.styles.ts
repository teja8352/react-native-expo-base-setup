import { StyleSheet } from "react-native";
import type { AppTheme } from "theme/createAppTheme";

export function createRegisterScreenStyles(theme: AppTheme) {
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
    backLink: {
      marginTop: theme.spacing.lg,
    },
    link: {
      color: theme.colors.link,
      fontSize: theme.typography.fontSize.md,
      paddingVertical: theme.spacing.xs,
    },
  });
}

import { StyleSheet } from "react-native";
import type { AppTheme } from "theme/createAppTheme";
import { layout } from "theme/tokens";

export function createAppTextInputStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrapper: {
      marginBottom: theme.spacing.md,
    },
    label: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
      marginBottom: theme.spacing.xs,
    },
    input: {
      minHeight: layout.touchTargetMin,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.inputBorder,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.inputBackground,
    },
    error: {
      marginTop: theme.spacing.xs,
      color: theme.colors.danger,
      fontSize: theme.typography.fontSize.sm,
    },
  });
}

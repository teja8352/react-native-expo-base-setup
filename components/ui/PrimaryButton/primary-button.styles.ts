import { StyleSheet } from "react-native";
import type { AppTheme } from "theme/createAppTheme";
import { layout } from "theme/tokens";

export function createPrimaryButtonStyles(theme: AppTheme) {
  return StyleSheet.create({
    button: {
      minHeight: layout.touchTargetMin,
      borderRadius: theme.borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
    },
    buttonDisabled: {
      opacity: 0.55,
    },
    buttonPressed: {
      opacity: 0.85,
    },
    label: {
      color: theme.colors.primaryOn,
      fontSize: theme.typography.fontSize.md,
      fontWeight: "600",
    },
  });
}

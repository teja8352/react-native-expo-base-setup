import type { PressableProps } from "react-native";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { useAppTheme, useThemedStyles } from "theme/useAppTheme";

import { createPrimaryButtonStyles } from "./primary-button.styles";

type PrimaryButtonProps = PressableProps & {
  label: string;
  loading?: boolean;
};

export function PrimaryButton({ label, loading, disabled, ...rest }: PrimaryButtonProps) {
  const theme = useAppTheme();
  const styles = useThemedStyles(createPrimaryButtonStyles);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled || loading), busy: Boolean(loading) }}
      style={({ pressed }) => [
        styles.button,
        (disabled || loading) && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.primaryOn} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

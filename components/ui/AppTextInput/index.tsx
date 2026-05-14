import type { TextInputProps } from "react-native";
import { Text, TextInput, View } from "react-native";
import { useAppTheme, useThemedStyles } from "theme/useAppTheme";

import { createAppTextInputStyles } from "./app-text-input.styles";

type AppTextInputProps = TextInputProps & {
  label: string;
  errorText?: string;
};

export function AppTextInput({ label, errorText, style, ...rest }: AppTextInputProps) {
  const theme = useAppTheme();
  const styles = useThemedStyles(createAppTextInputStyles);
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        style={[styles.input, style]}
        placeholderTextColor={theme.colors.textSecondary}
        accessibilityLabel={label}
      />
      {errorText ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

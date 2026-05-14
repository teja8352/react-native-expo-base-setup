import { ScreenScrollLayout } from "components/layout/ScreenScrollLayout";
import { AppTextInput } from "components/ui/AppTextInput";
import { PrimaryButton } from "components/ui/PrimaryButton";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "state/authStore";
import { useThemedStyles } from "theme/useAppTheme";

import { HREF_AUTH_LOGIN, PASSWORD_MIN_LENGTH } from "@/constants";

import { createResetPasswordScreenStyles } from "./reset-password.styles";

export default function ResetPasswordScreen() {
  const styles = useThemedStyles(createResetPasswordScreenStyles);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const params = useLocalSearchParams<{ token?: string | string[] }>();

  const paramToken = params.token;
  const initialToken =
    typeof paramToken === "string"
      ? paramToken
      : Array.isArray(paramToken)
        ? (paramToken[0] ?? "")
        : "";

  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialToken.length > 0) {
      setToken(initialToken);
    }
  }, [initialToken]);

  const onSubmit = async () => {
    setFormError(null);
    setMessage(null);
    if (!token.trim()) {
      setFormError("Reset token is required.");
      return;
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      setFormError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
      return;
    }
    setSubmitting(true);
    try {
      const result = await resetPassword(token.trim(), password);
      if (!result.ok) {
        setFormError(result.message);
        return;
      }
      setMessage(result.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenScrollLayout>
      <View style={styles.header}>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>Choose a new password for your account.</Text>
      </View>

      <AppTextInput
        label="Reset token"
        autoCapitalize="none"
        value={token}
        onChangeText={setToken}
      />
      <AppTextInput
        label="New password"
        secureTextEntry
        textContentType="newPassword"
        value={password}
        onChangeText={setPassword}
      />

      {formError ? (
        <Text style={styles.formError} accessibilityRole="alert">
          {formError}
        </Text>
      ) : null}
      {message ? (
        <Text style={styles.success} accessibilityLiveRegion="polite">
          {message}
        </Text>
      ) : null}

      <PrimaryButton
        label="Update password"
        loading={submitting}
        onPress={() => void onSubmit()}
      />

      <Link href={HREF_AUTH_LOGIN} asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Back to sign in"
          style={styles.backLink}
        >
          <Text style={styles.link}>Back to sign in</Text>
        </Pressable>
      </Link>
    </ScreenScrollLayout>
  );
}

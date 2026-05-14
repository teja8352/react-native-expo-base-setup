import { ScreenScrollLayout } from "components/layout/ScreenScrollLayout";
import { AppTextInput } from "components/ui/AppTextInput";
import { PrimaryButton } from "components/ui/PrimaryButton";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "state/authStore";
import { useThemedStyles } from "theme/useAppTheme";

import { EMAIL_REGEX, HREF_AUTH_LOGIN, HREF_AUTH_RESET_PASSWORD } from "@/constants";

import { createForgotPasswordScreenStyles } from "./forgot-password.styles";

export default function ForgotPasswordScreen() {
  const styles = useThemedStyles(createForgotPasswordScreenStyles);
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async () => {
    setFormError(null);
    setMessage(null);
    if (!EMAIL_REGEX.test(email.trim())) {
      setFormError("Enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await requestPasswordReset(email.trim());
      if (!result.ok) {
        setFormError(result.message);
        return;
      }
      setMessage(result.message);
      if (result.resetToken) {
        router.push(
          `${HREF_AUTH_RESET_PASSWORD}?token=${encodeURIComponent(result.resetToken)}`,
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenScrollLayout>
      <View style={styles.header}>
        <Text style={styles.title}>Forgot password</Text>
        <Text style={styles.subtitle}>
          We will email reset instructions if the account exists.
        </Text>
      </View>

      <AppTextInput
        label="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
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
        label="Send reset link"
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

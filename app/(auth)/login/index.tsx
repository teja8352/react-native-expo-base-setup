import { ScreenScrollLayout } from "components/layout/ScreenScrollLayout";
import { AppTextInput } from "components/ui/AppTextInput";
import { PrimaryButton } from "components/ui/PrimaryButton";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "state/authStore";
import { useThemedStyles } from "theme/useAppTheme";

import {
  EMAIL_REGEX,
  HREF_APP_TAB1,
  HREF_AUTH_FORGOT_PASSWORD,
  HREF_AUTH_REGISTER,
  PASSWORD_MIN_LENGTH,
} from "@/constants";

import { createLoginScreenStyles } from "./login.styles";

export default function LoginScreen() {
  const styles = useThemedStyles(createLoginScreenStyles);
  const signInWithPassword = useAuthStore((s) => s.signInWithPassword);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async () => {
    setFormError(null);
    if (!EMAIL_REGEX.test(email.trim())) {
      setFormError("Enter a valid email address.");
      return;
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      setFormError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
      return;
    }
    setSubmitting(true);
    try {
      const result = await signInWithPassword(email.trim(), password);
      if (!result.ok) {
        setFormError(result.message);
        return;
      }
      router.replace(HREF_APP_TAB1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenScrollLayout>
      <View style={styles.header}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Use your work credentials to continue.</Text>
      </View>

      <AppTextInput
        label="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="username"
        value={email}
        onChangeText={setEmail}
      />
      <AppTextInput
        label="Password"
        secureTextEntry
        textContentType="password"
        value={password}
        onChangeText={setPassword}
      />

      {formError ? (
        <Text style={styles.formError} accessibilityRole="alert">
          {formError}
        </Text>
      ) : null}

      <PrimaryButton label="Continue" loading={submitting} onPress={() => void onSubmit()} />

      <View style={styles.links}>
        <Link href={HREF_AUTH_REGISTER} asChild>
          <Pressable accessibilityRole="link" accessibilityLabel="Go to registration">
            <Text style={styles.link}>Create an account</Text>
          </Pressable>
        </Link>
        <Link href={HREF_AUTH_FORGOT_PASSWORD} asChild>
          <Pressable accessibilityRole="link" accessibilityLabel="Forgot password">
            <Text style={styles.link}>Forgot password</Text>
          </Pressable>
        </Link>
      </View>
    </ScreenScrollLayout>
  );
}

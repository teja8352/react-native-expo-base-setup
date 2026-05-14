import { ScreenScrollLayout } from "components/layout/ScreenScrollLayout";
import { AppTextInput } from "components/ui/AppTextInput";
import { PrimaryButton } from "components/ui/PrimaryButton";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "state/authStore";
import { useThemedStyles } from "theme/useAppTheme";

import { EMAIL_REGEX, HREF_APP_TAB1, HREF_AUTH_LOGIN, PASSWORD_MIN_LENGTH } from "@/constants";

import { createRegisterScreenStyles } from "./register.styles";

export default function RegisterScreen() {
  const styles = useThemedStyles(createRegisterScreenStyles);
  const registerWithPassword = useAuthStore((s) => s.registerWithPassword);

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
      const result = await registerWithPassword(email.trim(), password);
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
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Register to access the private area.</Text>
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
        textContentType="newPassword"
        value={password}
        onChangeText={setPassword}
      />

      {formError ? (
        <Text style={styles.formError} accessibilityRole="alert">
          {formError}
        </Text>
      ) : null}

      <PrimaryButton label="Register" loading={submitting} onPress={() => void onSubmit()} />

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

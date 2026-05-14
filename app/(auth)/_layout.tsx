import { Redirect, Stack } from "expo-router";
import { useSolidStackScreenOptions } from "router/useSolidStackScreenOptions";
import { useAuthStore } from "state/authStore";

import { HREF_APP_TAB1 } from "@/constants";

export default function AuthLayout() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const screenOptions = useSolidStackScreenOptions();

  if (!hydrated) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href={HREF_APP_TAB1} />;
  }

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="login" options={{ title: "Sign in" }} />
      <Stack.Screen name="register" options={{ title: "Create account" }} />
      <Stack.Screen name="forgot-password" options={{ title: "Forgot password" }} />
      <Stack.Screen name="reset-password" options={{ title: "Reset password" }} />
    </Stack>
  );
}

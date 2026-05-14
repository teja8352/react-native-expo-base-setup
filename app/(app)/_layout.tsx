import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "state/authStore";

import { HREF_AUTH_LOGIN } from "@/constants";

export default function AppGroupLayout() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href={HREF_AUTH_LOGIN} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Modal",
          headerShown: true,
        }}
      />
    </Stack>
  );
}

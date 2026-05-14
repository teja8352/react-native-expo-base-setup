import { Redirect } from "expo-router";
import { useAuthStore } from "state/authStore";

import { HREF_APP_TAB1, HREF_AUTH_LOGIN } from "@/constants";

export default function IndexRoute() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hydrated) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href={HREF_APP_TAB1} />;
  }

  return <Redirect href={HREF_AUTH_LOGIN} />;
}

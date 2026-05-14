import { loadRuntimeConfig } from "config/runtimeConfig";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useMemo, useState } from "react";
import { createAppServices } from "services/createAppServices";
import { useAuthStore } from "state/authStore";
import { setAppServices } from "state/serviceRegistry";
import { readStoredThemePreference, type ThemePreference } from "theme/ThemeProvider";

import { registerGlobalErrorHandlers } from "./globalErrorHandlers";

void SplashScreen.preventAutoHideAsync();

export type BootstrapState =
  | { status: "idle" }
  | { status: "running" }
  | { status: "ready"; themePreference: ThemePreference }
  | { status: "failed"; error: Error };

export function useAppBootstrap() {
  const [state, setState] = useState<BootstrapState>({ status: "idle" });

  const start = useCallback(async () => {
    setState({ status: "running" });
    try {
      const config = loadRuntimeConfig();
      const services = createAppServices(config);
      setAppServices(services);
      registerGlobalErrorHandlers(services.logger);

      await Font.loadAsync({});

      await useAuthStore.getState().hydrateFromStorage();

      const themePreference = await readStoredThemePreference();

      setState({ status: "ready", themePreference });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Bootstrap failed");
      setState({ status: "failed", error: err });
    }
  }, []);

  return useMemo(() => ({ state, start }), [start, state]);
}

import "react-native-gesture-handler";

import { AppErrorBoundary } from "components/errors/AppErrorBoundary";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { AppProviders } from "providers/AppProviders";
import { useEffect } from "react";
import { useAppBootstrap } from "startup/bootstrap/useAppBootstrap";
import { FatalStartupView } from "startup/FatalStartupView";
import { useAppStore } from "state/appStore";
import { getAppServices } from "state/serviceRegistry";

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const { state, start } = useAppBootstrap();

  useEffect(() => {
    void start();
  }, [start]);

  useEffect(() => {
    if (state.status === "ready" || state.status === "failed") {
      void SplashScreen.hideAsync();
    }
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "ready") {
      return undefined;
    }
    const services = getAppServices();
    return services.network.subscribe((net) => {
      const online = Boolean(net.isConnected ?? net.isInternetReachable);
      useAppStore.getState().setOnline(online);
    });
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "ready") {
      return undefined;
    }
    const services = getAppServices();
    const subscription = services.backButton.bindAndroidHardwareBack();
    return () => subscription.remove();
  }, [state.status]);

  if (state.status === "idle" || state.status === "running") {
    return null;
  }

  if (state.status === "failed") {
    return <FatalStartupView message={state.error.message} />;
  }

  return (
    <AppErrorBoundary>
      <AppProviders services={getAppServices()} initialThemePreference={state.themePreference}>
        <Stack screenOptions={{ headerShown: false }} />
      </AppProviders>
    </AppErrorBoundary>
  );
}

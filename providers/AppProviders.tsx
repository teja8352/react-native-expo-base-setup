import { ServicesProvider } from "contexts/ServicesContext";
import type { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { AppServices } from "services/createAppServices";
import { type ThemePreference, ThemeProvider } from "theme/ThemeProvider";

import { ThemedStatusBar } from "../hooks/ThemedStatusBar";
import { useRootSystemUiBackground } from "../hooks/useRootSystemUiBackground";

function ThemedChrome({ children }: PropsWithChildren) {
  useRootSystemUiBackground();
  return (
    <>
      <ThemedStatusBar />
      {children}
    </>
  );
}

type AppProvidersProps = PropsWithChildren<{
  services: AppServices;
  initialThemePreference: ThemePreference;
}>;

export function AppProviders({
  children,
  services,
  initialThemePreference,
}: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ServicesProvider services={services}>
          <ThemeProvider initialPreference={initialThemePreference}>
            <ThemedChrome>{children}</ThemedChrome>
          </ThemeProvider>
        </ServicesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

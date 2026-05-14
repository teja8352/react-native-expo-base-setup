import { useMemo } from "react";
import { useAppTheme } from "theme/useAppTheme";

export function useSolidStackScreenOptions() {
  const theme = useAppTheme();
  return useMemo(
    () => ({
      headerShown: true,
      headerTransparent: false as const,
      headerShadowVisible: false,
      headerStyle: { backgroundColor: theme.colors.surface },
      headerTintColor: theme.colors.textPrimary,
      headerTitleStyle: { color: theme.colors.textPrimary, fontWeight: "600" as const },
      contentStyle: { backgroundColor: theme.colors.background },
    }),
    [theme.colors.background, theme.colors.surface, theme.colors.textPrimary],
  );
}

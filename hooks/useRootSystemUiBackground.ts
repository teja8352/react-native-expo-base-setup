import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { useAppTheme } from "theme/useAppTheme";

export function useRootSystemUiBackground(): void {
  const theme = useAppTheme();
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);
}

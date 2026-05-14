import type { AppTheme } from "theme/createAppTheme";

export type StatusBarVisualProps = {
  style: "light" | "dark";
  backgroundColor: string;
  translucent: boolean;
};

export type StatusBarService = {
  resolveProps(theme: AppTheme, surface: "default" | "modal"): StatusBarVisualProps;
};

export function createStatusBarService(): StatusBarService {
  return {
    resolveProps(theme, surface) {
      const isLightSurface = theme.mode === "light";
      const backgroundColor =
        surface === "modal" ? theme.colors.surfaceElevated : theme.colors.surface;
      return {
        style: isLightSurface ? "dark" : "light",
        backgroundColor,
        translucent: false,
      };
    },
  };
}

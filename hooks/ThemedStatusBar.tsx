import { useServices } from "contexts/ServicesContext";
import { StatusBar } from "expo-status-bar";
import { useAppTheme } from "theme/useAppTheme";

export function ThemedStatusBar() {
  const theme = useAppTheme();
  const { statusBar } = useServices();
  const props = statusBar.resolveProps(theme, "default");
  return <StatusBar style={props.style} backgroundColor={props.backgroundColor} />;
}

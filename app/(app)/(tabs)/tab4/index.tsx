import { ScreenScrollLayout } from "components/layout/ScreenScrollLayout";
import { useRequireAuth } from "hooks/useRequireAuth";
import { Pressable, Text, View } from "react-native";
import { useThemeContext } from "theme/ThemeProvider";
import { useThemedStyles } from "theme/useAppTheme";

import { createTab4HomeScreenStyles } from "./tab4-home.styles";

export default function Tab4HomeScreen() {
  const isSessionActive = useRequireAuth();
  const styles = useThemedStyles(createTab4HomeScreenStyles);
  const { preference, setPreference } = useThemeContext();

  if (!isSessionActive) {
    return null;
  }

  const cyclePreference = async () => {
    if (preference === "system") {
      await setPreference("light");
      return;
    }
    if (preference === "light") {
      await setPreference("dark");
      return;
    }
    await setPreference("system");
  };

  return (
    <ScreenScrollLayout>
      <View style={styles.section}>
        <Text style={styles.title}>Tab 4</Text>
        <Text style={styles.body}>Theme preference: {preference}</Text>
        <Pressable
          onPress={() => void cyclePreference()}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel="Cycle theme preference"
        >
          <Text style={styles.buttonLabel}>Cycle theme</Text>
        </Pressable>
      </View>
    </ScreenScrollLayout>
  );
}

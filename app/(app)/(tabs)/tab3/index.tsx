import { ScreenScrollLayout } from "components/layout/ScreenScrollLayout";
import { useRequireAuth } from "hooks/useRequireAuth";
import { Text, View } from "react-native";
import { useThemedStyles } from "theme/useAppTheme";

import { createTab3HomeScreenStyles } from "./tab3-home.styles";

export default function Tab3HomeScreen() {
  const isSessionActive = useRequireAuth();
  const styles = useThemedStyles(createTab3HomeScreenStyles);

  if (!isSessionActive) {
    return null;
  }

  return (
    <ScreenScrollLayout>
      <View style={styles.section}>
        <Text style={styles.title}>Tab 3</Text>
        <Text style={styles.body}>Independent stack navigation for tab three.</Text>
      </View>
    </ScreenScrollLayout>
  );
}

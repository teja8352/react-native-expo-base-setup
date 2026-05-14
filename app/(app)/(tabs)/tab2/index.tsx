import { ScreenScrollLayout } from "components/layout/ScreenScrollLayout";
import { PrimaryButton } from "components/ui/PrimaryButton";
import { usePresentAppModal } from "hooks/usePresentAppModal";
import { useRequireAuth } from "hooks/useRequireAuth";
import { Text, View } from "react-native";
import { useThemedStyles } from "theme/useAppTheme";

import { createTab2HomeScreenStyles } from "./tab2-home.styles";

export default function Tab2HomeScreen() {
  const isSessionActive = useRequireAuth();
  const presentAppModal = usePresentAppModal();
  const styles = useThemedStyles(createTab2HomeScreenStyles);

  if (!isSessionActive) {
    return null;
  }

  return (
    <ScreenScrollLayout>
      <View style={styles.section}>
        <Text style={styles.title}>Tab 2</Text>
        <Text style={styles.body}>Independent stack navigation for tab two.</Text>
        <PrimaryButton label="Open modal" onPress={() => presentAppModal()} />
      </View>
    </ScreenScrollLayout>
  );
}

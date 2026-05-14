import { ScreenScrollLayout } from "components/layout/ScreenScrollLayout";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useThemedStyles } from "theme/useAppTheme";

import { createModalScreenStyles } from "./modal.styles";

export default function AppModalScreen() {
  const styles = useThemedStyles(createModalScreenStyles);

  return (
    <ScreenScrollLayout>
      <View style={styles.section}>
        <Text style={styles.title}>Modal</Text>
        <Text style={styles.body}>
          Example modal route using native stack presentation. Deep links resolve through Expo
          Router and `expo-linking`.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel="Close modal"
        >
          <Text style={styles.buttonLabel}>Close</Text>
        </Pressable>
      </View>
    </ScreenScrollLayout>
  );
}

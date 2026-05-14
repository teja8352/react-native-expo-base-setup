import { Text, View } from "react-native";

import { fatalStartupViewStyles as styles } from "./FatalStartupView.styles";

type FatalStartupViewProps = {
  message: string;
};

export function FatalStartupView({ message }: FatalStartupViewProps) {
  {
    console.error("FatalStartupView", message);
  }
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.title}>Startup failed</Text>
      <Text style={styles.body}>{message}</Text>
    </View>
  );
}

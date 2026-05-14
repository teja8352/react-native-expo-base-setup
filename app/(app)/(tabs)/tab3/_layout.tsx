import { Stack } from "expo-router";
import { useSolidStackScreenOptions } from "router/useSolidStackScreenOptions";

export default function Tab3Layout() {
  const screenOptions = useSolidStackScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: "Tab 3" }} />
    </Stack>
  );
}

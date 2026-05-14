import { ScreenScrollLayout } from "components/layout/ScreenScrollLayout";
import { PrimaryButton } from "components/ui/PrimaryButton";
import { useRequireAuth } from "hooks/useRequireAuth";
import { Alert, Text, View } from "react-native";
import { useAppStore } from "state/appStore";
import { useAuthStore } from "state/authStore";
import { getAppServices } from "state/serviceRegistry";
import { useThemedStyles } from "theme/useAppTheme";

import { createTab1HomeScreenStyles } from "./tab1-home.styles";

export default function Tab1HomeScreen() {
  const isSessionActive = useRequireAuth();
  const styles = useThemedStyles(createTab1HomeScreenStyles);
  const signOut = useAuthStore((state) => state.signOut);
  const isOnline = useAppStore((state) => state.isOnline);

  if (!isSessionActive) {
    return null;
  }

  const appServices = getAppServices();
  const permissions = appServices.permissions;

  const handlePermissionRequest = () => {
    Alert.alert("Permissions Required", "Please allow the permissions that are requested.", [
      { text: "Cancel", style: "cancel" },
      { text: "Allow", onPress: () => void askPermissions() },
    ]);
  };

  const askPermissions = async () => {
    try {
      const camera = await permissions.request("camera");
      console.log("camera", camera);

      const microphone = await permissions.request("microphone");
      console.log("microphone", microphone);

      const mediaLibrary = await permissions.request("mediaLibrary");
      console.log("mediaLibrary", mediaLibrary);

      const location = await permissions.request("location");
      console.log("location", location);

      const notifications = await permissions.request("notifications");
      console.log("notifications", notifications);

      return {
        camera,
        microphone,
        mediaLibrary,
        location,
        notifications,
      };
    } catch (error) {
      console.error("Permission request failed:", error);
    }
  };

  return (
    <ScreenScrollLayout>
      <View style={styles.section}>
        <Text style={styles.title}>Tab 1</Text>
        <Text style={styles.body}>This stack is scoped to the first tab.</Text>
        <Text style={styles.meta}>Network status: {isOnline ? "Online" : "Offline"}</Text>
        <PrimaryButton label="Sign out" onPress={() => void signOut()} />
        <PrimaryButton label="Ask Permissions" onPress={() => handlePermissionRequest()} />
      </View>
    </ScreenScrollLayout>
  );
}

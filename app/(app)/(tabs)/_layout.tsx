import Ionicons from "@expo/vector-icons/Ionicons";
import { useServices } from "contexts/ServicesContext";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler, Platform, ToastAndroid } from "react-native";
import { useAppTheme } from "theme/useAppTheme";

import { DOUBLE_TAP_EXIT_INTERVAL_MS } from "@/constants/timing";

export default function TabsLayout() {
  const theme = useAppTheme();
  const { backButton } = useServices();
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== "android") {
      return undefined;
    }
    let lastBackPress = 0;
    return backButton.pushHandler(() => {
      if (router.canGoBack()) {
        router.back();
        return true;
      }
      const now = Date.now();
      if (now - lastBackPress < DOUBLE_TAP_EXIT_INTERVAL_MS) {
        BackHandler.exitApp();
        return true;
      }
      lastBackPress = now;
      ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
      return true;
    });
  }, [backButton, router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.tabBarBorder,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
        },
      }}
    >
      <Tabs.Screen
        name="tab1"
        options={{
          title: "Tab 1",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="layers-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="tab2"
        options={{
          title: "Tab 2",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="grid-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="tab3"
        options={{
          title: "Tab 3",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="albums-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="tab4"
        options={{
          title: "Tab 4",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="apps-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

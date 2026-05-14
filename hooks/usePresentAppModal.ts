import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useCallback } from "react";

import { HREF_APP_MODAL } from "@/constants";

/**
 * Presents `app/(app)/modal` on the authenticated root stack so `presentation: "modal"`
 * applies. `router.push` from a tab's nested stack often targets the wrong navigator
 * and looks like a normal route push.
 */
export function usePresentAppModal() {
  const navigation = useNavigation();
  const router = useRouter();

  return useCallback(() => {
    let current: NavigationProp<ParamListBase> | undefined =
      navigation as NavigationProp<ParamListBase>;
    for (let i = 0; i < 12; i++) {
      const names = current.getState?.()?.routeNames;
      if (names?.includes("modal")) {
        current.dispatch(CommonActions.navigate({ name: "modal" }));
        return;
      }
      current = current.getParent?.() as NavigationProp<ParamListBase> | undefined;
      if (!current) {
        break;
      }
    }
    router.push(HREF_APP_MODAL);
  }, [navigation, router]);
}

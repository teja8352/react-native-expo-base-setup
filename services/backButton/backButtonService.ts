import { BackHandler, type NativeEventSubscription } from "react-native";

export type BackHandlerFn = () => boolean;

export type BackButtonService = {
  pushHandler(handler: BackHandlerFn): () => void;
  clearHandlers(): void;
  bindAndroidHardwareBack(): NativeEventSubscription;
};

export function createBackButtonService(): BackButtonService {
  const stack: BackHandlerFn[] = [];

  return {
    pushHandler(handler) {
      stack.push(handler);
      return () => {
        const index = stack.lastIndexOf(handler);
        if (index >= 0) {
          stack.splice(index, 1);
        }
      };
    },
    clearHandlers() {
      stack.length = 0;
    },
    bindAndroidHardwareBack() {
      return BackHandler.addEventListener("hardwareBackPress", () => {
        for (let i = stack.length - 1; i >= 0; i -= 1) {
          const handler = stack[i];
          if (handler?.()) {
            return true;
          }
        }
        return false;
      });
    },
  };
}

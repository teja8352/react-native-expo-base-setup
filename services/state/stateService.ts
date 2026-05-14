import { AppState, type AppStateStatus } from "react-native";

import type { LoggerService } from "../logger";

export type AppStateListener = (next: AppStateStatus) => void;

export type StateService = {
  getCurrentState(): AppStateStatus;
  subscribe(listener: AppStateListener): () => void;
};

export function createStateService(logger: LoggerService): StateService {
  return {
    getCurrentState() {
      return AppState.currentState;
    },
    subscribe(listener) {
      const subscription = AppState.addEventListener("change", (state) => {
        logger.debug("AppState changed", { state });
        listener(state);
      });
      return () => subscription.remove();
    },
  };
}

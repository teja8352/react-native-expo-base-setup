import * as ScreenOrientation from "expo-screen-orientation";

import type { LoggerService } from "../logger";

export type OrientationLock = ScreenOrientation.OrientationLock;

export type OrientationService = {
  lock(orientation: OrientationLock): Promise<void>;
  unlock(): Promise<void>;
  getOrientationAsync(): Promise<ScreenOrientation.Orientation>;
  addOrientationChangeListener(
    listener: (event: ScreenOrientation.OrientationChangeEvent) => void,
  ): ScreenOrientation.Subscription;
};

export function createOrientationService(logger: LoggerService): OrientationService {
  return {
    async lock(orientation) {
      await ScreenOrientation.lockAsync(orientation);
      logger.debug("Orientation locked", { orientation });
    },
    async unlock() {
      await ScreenOrientation.unlockAsync();
      logger.debug("Orientation unlocked");
    },
    async getOrientationAsync() {
      return ScreenOrientation.getOrientationAsync();
    },
    addOrientationChangeListener(listener) {
      return ScreenOrientation.addOrientationChangeListener(listener);
    },
  };
}

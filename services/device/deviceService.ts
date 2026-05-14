import * as Device from "expo-device";
import { Dimensions, Platform } from "react-native";

import type { LoggerService } from "../logger";

export type DeviceClass = "phone" | "tablet" | "desktop" | "unknown";

export type DeviceSnapshot = {
  platform: typeof Platform.OS;
  deviceClass: DeviceClass;
  osVersion: string | null;
  modelName: string | null;
  brand: string | null;
  screenWidth: number;
  screenHeight: number;
  isPhysicalDevice: boolean;
};

export type DeviceService = {
  getSnapshot(): DeviceSnapshot;
  subscribeDimensions(listener: () => void): () => void;
  responsiveScale(width: number): number;
};

function resolveDeviceClass(): DeviceClass {
  if (Platform.OS === "web") {
    return "desktop";
  }
  if (Device.deviceType === Device.DeviceType.TABLET) {
    return "tablet";
  }
  if (Device.deviceType === Device.DeviceType.PHONE) {
    return "phone";
  }
  return "unknown";
}

export function createDeviceService(logger: LoggerService): DeviceService {
  const getSnapshot = (): DeviceSnapshot => {
    const { width, height } = Dimensions.get("window");
    return {
      platform: Platform.OS,
      deviceClass: resolveDeviceClass(),
      osVersion: Device.osVersion,
      modelName: Device.modelName,
      brand: Device.brand,
      screenWidth: width,
      screenHeight: height,
      isPhysicalDevice: Device.isDevice,
    };
  };

  return {
    getSnapshot,
    subscribeDimensions(listener) {
      const subscription = Dimensions.addEventListener("change", () => {
        logger.debug("Window dimensions changed");
        listener();
      });
      return () => subscription.remove();
    },
    responsiveScale(width) {
      const baseWidth = 390;
      const current = Dimensions.get("window").width;
      return (current / baseWidth) * width;
    },
  };
}

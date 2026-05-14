import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

import type { LoggerService } from "../logger";

export type PermissionResource =
  | "camera"
  | "microphone"
  | "mediaLibrary"
  | "location"
  | "notifications";

export type PermissionOutcome = "granted" | "denied" | "blocked" | "limited" | "unavailable";

export type PermissionsService = {
  request(resource: PermissionResource): Promise<PermissionOutcome>;
  getStatus(resource: PermissionResource): Promise<PermissionOutcome>;
};

function mapLocationStatus(status: Location.PermissionStatus): PermissionOutcome {
  if (status === Location.PermissionStatus.GRANTED) {
    return "granted";
  }
  if (status === Location.PermissionStatus.DENIED) {
    return "denied";
  }
  return "blocked";
}

function mapMediaLibraryResult(
  result: ImagePicker.MediaLibraryPermissionResponse,
): PermissionOutcome {
  if (result.accessPrivileges === "limited") {
    return "limited";
  }
  if (result.accessPrivileges === "all") {
    return "granted";
  }
  if (result.accessPrivileges === "none") {
    return result.canAskAgain ? "denied" : "blocked";
  }
  if (result.status === ImagePicker.PermissionStatus.GRANTED) {
    return "granted";
  }
  if (result.status === ImagePicker.PermissionStatus.DENIED) {
    return result.canAskAgain ? "denied" : "blocked";
  }
  return "denied";
}

export function createPermissionsService(logger: LoggerService): PermissionsService {
  return {
    async request(resource) {
      logger.debug("Permission requested", { resource });
      switch (resource) {
        case "camera": {
          const result = await Camera.requestCameraPermissionsAsync();
          return result.granted ? "granted" : result.canAskAgain ? "denied" : "blocked";
        }
        case "microphone": {
          const result = await Camera.requestMicrophonePermissionsAsync();
          return result.granted ? "granted" : result.canAskAgain ? "denied" : "blocked";
        }
        case "mediaLibrary": {
          const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
          return mapMediaLibraryResult(result);
        }
        case "location": {
          const result = await Location.requestForegroundPermissionsAsync();
          return mapLocationStatus(result.status);
        }
        case "notifications": {
          const settings = await Notifications.requestPermissionsAsync();
          if (
            settings.granted ||
            settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
          ) {
            return "granted";
          }
          if (settings.canAskAgain) {
            return "denied";
          }
          return "blocked";
        }
        default: {
          const exhaustive: never = resource;
          return exhaustive;
        }
      }
    },
    async getStatus(resource) {
      switch (resource) {
        case "camera": {
          const result = await Camera.getCameraPermissionsAsync();
          return result.granted ? "granted" : result.canAskAgain ? "denied" : "blocked";
        }
        case "microphone": {
          const result = await Camera.getMicrophonePermissionsAsync();
          return result.granted ? "granted" : result.canAskAgain ? "denied" : "blocked";
        }
        case "mediaLibrary": {
          const result = await ImagePicker.getMediaLibraryPermissionsAsync();
          return mapMediaLibraryResult(result);
        }
        case "location": {
          const result = await Location.getForegroundPermissionsAsync();
          return mapLocationStatus(result.status);
        }
        case "notifications": {
          const settings = await Notifications.getPermissionsAsync();
          if (settings.status === "undetermined") {
            return "denied";
          }
          if (settings.granted) {
            return "granted";
          }
          return settings.canAskAgain ? "denied" : "blocked";
        }
        default: {
          const exhaustive: never = resource;
          return exhaustive;
        }
      }
    },
  };
}

import * as Location from "expo-location";

import { LOCATION_DEFAULT_TIMEOUT_MS } from "@/constants/timing";

import type { LoggerService } from "../logger";

class LocationTimeoutError extends Error {
  constructor() {
    super("LOCATION_TIMEOUT");
    this.name = "LocationTimeoutError";
  }
}

export type LocationResult =
  | {
      ok: true;
      coords: Location.LocationObjectCoords;
    }
  | {
      ok: false;
      reason: "permission" | "timeout" | "unavailable" | "unknown";
      message: string;
    };

export type LocationService = {
  getCurrentPosition(): Promise<LocationResult>;
};

export function createLocationService(logger: LoggerService): LocationService {
  return {
    async getCurrentPosition() {
      const permission = await Location.getForegroundPermissionsAsync();
      if (permission.status !== Location.PermissionStatus.GRANTED) {
        return {
          ok: false,
          reason: "permission",
          message: "Location permission is not granted.",
        };
      }
      try {
        const position = await Promise.race([
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            mayShowUserSettingsDialog: true,
          }),
          new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new LocationTimeoutError());
            }, LOCATION_DEFAULT_TIMEOUT_MS);
          }),
        ]);
        return { ok: true, coords: position.coords };
      } catch (error) {
        logger.warn("Location retrieval failed", { error });
        if (error instanceof LocationTimeoutError) {
          return {
            ok: false,
            reason: "timeout",
            message: "Location request timed out.",
          };
        }
        const message = error instanceof Error ? error.message : "Location unavailable";
        return { ok: false, reason: "unknown", message };
      }
    },
  };
}

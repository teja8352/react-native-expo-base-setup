import type { RuntimeConfig } from "config/runtimeConfig";

import { type BackButtonService, createBackButtonService } from "./backButton";
import { createDeviceService, type DeviceService } from "./device";
import { createHttpService, type HttpService } from "./http";
import { createLocationService, type LocationService } from "./location";
import { createLoggerService, type LoggerService } from "./logger";
import { createNetworkService, type NetworkService } from "./network";
import { createOrientationService, type OrientationService } from "./orientation";
import { createPermissionsService, type PermissionsService } from "./permissions";
import { createSecureStorageService, type SecureStorageService } from "./secureStorage";
import { createStateService, type StateService } from "./state";
import { createStatusBarService, type StatusBarService } from "./statusBar";

export type AppServices = {
  config: RuntimeConfig;
  logger: LoggerService;
  secureStorage: SecureStorageService;
  http: HttpService;
  network: NetworkService;
  orientation: OrientationService;
  statusBar: StatusBarService;
  permissions: PermissionsService;
  location: LocationService;
  device: DeviceService;
  backButton: BackButtonService;
  state: StateService;
};

export function createAppServices(config: RuntimeConfig): AppServices {
  const logger = createLoggerService(config);
  const secureStorage = createSecureStorageService();
  const http = createHttpService(config, logger);
  const network = createNetworkService(logger);
  const orientation = createOrientationService(logger);
  const statusBar = createStatusBarService();
  const permissions = createPermissionsService(logger);
  const location = createLocationService(logger);
  const device = createDeviceService(logger);
  const backButton = createBackButtonService();
  const state = createStateService(logger);

  return {
    config,
    logger,
    secureStorage,
    http,
    network,
    orientation,
    statusBar,
    permissions,
    location,
    device,
    backButton,
    state,
  };
}

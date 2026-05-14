import type { AppServices } from "services/createAppServices";

let services: AppServices | null = null;

export function setAppServices(next: AppServices): void {
  services = next;
}

export function getAppServices(): AppServices {
  if (!services) {
    throw new Error("Application services are not initialized yet.");
  }
  return services;
}

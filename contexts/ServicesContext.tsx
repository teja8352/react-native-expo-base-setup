import { createContext, type ReactNode, useContext } from "react";
import type { AppServices } from "services/createAppServices";

const ServicesContext = createContext<AppServices | null>(null);

type ServicesProviderProps = {
  services: AppServices;
  children: ReactNode;
};

export function ServicesProvider({ services, children }: ServicesProviderProps) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices(): AppServices {
  const ctx = useContext(ServicesContext);
  if (!ctx) {
    throw new Error("useServices must be used within ServicesProvider.");
  }
  return ctx;
}

import Constants from "expo-constants";

import {
  assertProductionApiUrl,
  type RuntimeConfig,
  RuntimeConfigSchema,
} from "./runtimeConfig.schema";

function readExtra(): Record<string, unknown> {
  const extra = Constants.expoConfig?.extra;
  if (!extra || typeof extra !== "object") {
    throw new Error("Expo config extra is missing. Check app.config.ts.");
  }
  return extra as Record<string, unknown>;
}

export function loadRuntimeConfig(): RuntimeConfig {
  const raw = readExtra();
  const parsed = RuntimeConfigSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid application configuration: ${message}`);
  }
  const base = parsed.data;
  const config: RuntimeConfig = {
    ...base,
    AUTH_USE_HTTP: base.AUTH_USE_HTTP && base.API_BASE_URL.length > 0,
  };
  assertProductionApiUrl(config);
  return config;
}

export type { RuntimeConfig };

import { z } from "zod";

const AppEnvironmentSchema = z.enum(["development", "staging", "production"]);

function coerceAuthUseHttp(value: unknown): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const lower = value.trim().toLowerCase();
    return lower !== "false" && lower !== "0" && lower !== "no";
  }
  return Boolean(value);
}

export const RuntimeConfigSchema = z
  .object({
    APP_ENV: AppEnvironmentSchema,
    APP_NAME: z.string().min(1),
    APP_SLUG: z.string().min(1),
    APP_VERSION: z.string().min(1),
    APP_BUILD_NUMBER: z.string().min(1),
    API_BASE_URL: z.string().transform((s) => s.trim()),
    API_VERSION: z.string().min(1),
    DEEP_LINK_SCHEME: z.string().min(1),
    /** Request HTTP auth when true; effective HTTP auth is also false if API_BASE_URL is empty (see loadRuntimeConfig). */
    AUTH_USE_HTTP: z.preprocess(coerceAuthUseHttp, z.boolean()),
  })
  .superRefine((data, ctx) => {
    if (data.API_BASE_URL.length === 0) {
      return;
    }
    if (!/^https?:\/\//iu.test(data.API_BASE_URL)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["API_BASE_URL"],
        message: "EXPO_PUBLIC_API_BASE_URL must start with http:// or https:// when set.",
      });
    }
  });

export type RuntimeConfig = z.infer<typeof RuntimeConfigSchema>;

export function assertProductionApiUrl(config: RuntimeConfig): void {
  if (config.APP_ENV !== "production") {
    return;
  }
  if (config.API_BASE_URL.length === 0) {
    throw new Error("EXPO_PUBLIC_API_BASE_URL is required when APP_ENV is production.");
  }
  if (!/^https?:\/\//iu.test(config.API_BASE_URL)) {
    throw new Error(
      "EXPO_PUBLIC_API_BASE_URL must be a full http(s) URL when APP_ENV is production.",
    );
  }
}

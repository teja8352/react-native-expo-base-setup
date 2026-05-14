import {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  create,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";
import type { RuntimeConfig } from "config/runtimeConfig";
import type { ApiFailure, ApiResult } from "types/api.types";
import { sleep } from "utils/sleep";

import {
  HTTP_DEFAULT_TIMEOUT_MS,
  HTTP_MAX_RETRIES,
  HTTP_RETRY_BASE_DELAY_MS,
} from "@/constants/timing";

import { authSession } from "../authSession";
import type { LoggerService } from "../logger";
import { httpAuthBridge } from "./httpAuthBridge";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
    skipRefresh?: boolean;
    _retry?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
    skipRefresh?: boolean;
    _retry?: boolean;
  }
}

let refreshPromise: Promise<string | null> | null = null;

function normalizeAxiosError(error: unknown): ApiFailure {
  if (isAxiosError(error)) {
    const ax = error as AxiosError<{ message?: string; code?: string }>;
    const status = ax.response?.status ?? null;
    const body = ax.response?.data;
    const noResponse = status === null;
    const networkLike =
      noResponse && (ax.code === "ERR_NETWORK" || ax.message === "Network Error");
    const message = networkLike
      ? "Cannot reach the API. Confirm the backend is running, EXPO_PUBLIC_API_BASE_URL is correct, and (on a physical device) use your computer's LAN IP instead of localhost."
      : (typeof body?.message === "string" && body.message) || ax.message || "Request failed";
    const code =
      (typeof body?.code === "string" && body.code) ||
      (status ? `HTTP_${status}` : "NETWORK_ERROR");
    return {
      ok: false,
      status,
      code,
      message,
      details: body,
    };
  }
  return {
    ok: false,
    status: null,
    code: "UNKNOWN_ERROR",
    message: error instanceof Error ? error.message : "Unknown error",
    details: error,
  };
}

async function performRefresh(
  client: AxiosInstance,
  logger: LoggerService,
): Promise<string | null> {
  const refreshToken = authSession.getRefreshToken();
  if (!refreshToken) {
    return null;
  }
  try {
    const response = await client.post<{ accessToken: string; refreshToken?: string }>(
      "auth/refresh",
      { refreshToken },
      { skipAuth: true, skipRefresh: true },
    );
    const accessToken = response.data.accessToken;
    const nextRefresh = response.data.refreshToken ?? refreshToken;
    authSession.setTokens({ accessToken, refreshToken: nextRefresh });
    return accessToken;
  } catch (error) {
    logger.warn("Token refresh failed", { error });
    return null;
  }
}

export type HttpService = {
  client: AxiosInstance;
  request<T>(config: AxiosRequestConfig): Promise<ApiResult<T>>;
  cancelTokenSource(): AbortController;
};

export function createHttpService(config: RuntimeConfig, logger: LoggerService): HttpService {
  const resolvedRoot =
    config.API_BASE_URL.length > 0
      ? config.API_BASE_URL.replace(/\/$/u, "")
      : "https://offline.invalid";
  const baseURL = `${resolvedRoot}/${config.API_VERSION}/`;

  const client = create({
    baseURL,
    timeout: HTTP_DEFAULT_TIMEOUT_MS,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use(async (req: InternalAxiosRequestConfig) => {
    if (req.skipAuth) {
      return req;
    }
    const token = authSession.getAccessToken();
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config;
      if (!original || original.skipRefresh || original.skipAuth) {
        return Promise.reject(error);
      }
      const status = error.response?.status;
      if (status !== 401 || original._retry) {
        return Promise.reject(error);
      }
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = performRefresh(client, logger).finally(() => {
          refreshPromise = null;
        });
      }
      const newAccess = await refreshPromise;
      if (!newAccess) {
        httpAuthBridge.notifySessionInvalidated();
        return Promise.reject(error);
      }
      const headers = AxiosHeaders.from(original.headers ?? {});
      headers.set("Authorization", `Bearer ${newAccess}`);
      original.headers = headers;
      return client(original);
    },
  );

  const request = async <T>(req: AxiosRequestConfig): Promise<ApiResult<T>> => {
    let attempt = 0;
    while (attempt <= HTTP_MAX_RETRIES) {
      try {
        const response = await client.request<T>(req);
        return { ok: true, data: response.data, status: response.status };
      } catch (error) {
        const normalized = normalizeAxiosError(error);
        const retryable =
          normalized.status === null ||
          normalized.status === 408 ||
          normalized.status === 429 ||
          (normalized.status >= 500 && normalized.status < 600);
        if (!retryable || attempt === HTTP_MAX_RETRIES) {
          return normalized;
        }
        const delay = HTTP_RETRY_BASE_DELAY_MS * 2 ** attempt;
        logger.warn("HTTP request retry", { delay, attempt });
        await sleep(delay);
        attempt += 1;
      }
    }
    return {
      ok: false,
      status: null,
      code: "RETRY_EXHAUSTED",
      message: "Maximum retries exceeded",
    };
  };

  return {
    client,
    request,
    cancelTokenSource() {
      return new AbortController();
    },
  };
}

export { normalizeAxiosError };

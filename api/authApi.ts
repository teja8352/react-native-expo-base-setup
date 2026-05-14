import type { HttpService } from "services/http";
import type { ApiResult } from "types/api.types";
import type { AuthSession } from "types/auth.types";
import { z } from "zod";

import {
  API_AUTH_FORGOT_PASSWORD,
  API_AUTH_LOGIN,
  API_AUTH_LOGOUT,
  API_AUTH_REGISTER,
  API_AUTH_RESET_PASSWORD,
} from "./endpoints";

const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

const AuthSessionResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: AuthUserSchema,
});

const MessageResponseSchema = z.object({
  message: z.string(),
});

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload;

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

function mapSession(data: unknown, status: number): ApiResult<AuthSession> {
  const parsed = AuthSessionResponseSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      status: null,
      code: "INVALID_AUTH_RESPONSE",
      message: "Authentication response was invalid.",
      details: parsed.error.flatten(),
    };
  }
  return {
    ok: true,
    data: parsed.data,
    status,
  };
}

export async function postLogin(
  http: HttpService,
  payload: LoginPayload,
): Promise<ApiResult<AuthSession>> {
  const result = await http.request<unknown>({
    method: "POST",
    url: API_AUTH_LOGIN,
    data: payload,
    skipAuth: true,
  });
  if (!result.ok) {
    return result;
  }
  return mapSession(result.data, result.status);
}

export async function postRegister(
  http: HttpService,
  payload: RegisterPayload,
): Promise<ApiResult<AuthSession>> {
  const result = await http.request<unknown>({
    method: "POST",
    url: API_AUTH_REGISTER,
    data: payload,
    skipAuth: true,
  });
  if (!result.ok) {
    return result;
  }
  return mapSession(result.data, result.status);
}

export async function postLogout(http: HttpService): Promise<ApiResult<{ message: string }>> {
  const result = await http.request<unknown>({
    method: "POST",
    url: API_AUTH_LOGOUT,
  });
  if (!result.ok) {
    return result;
  }
  const parsed = MessageResponseSchema.safeParse(result.data);
  if (!parsed.success) {
    return {
      ok: false,
      status: result.status,
      code: "INVALID_MESSAGE_RESPONSE",
      message: "Unexpected response shape.",
    };
  }
  return { ok: true, data: parsed.data, status: result.status };
}

export async function postForgotPassword(
  http: HttpService,
  payload: ForgotPasswordPayload,
): Promise<ApiResult<{ message: string }>> {
  const result = await http.request<unknown>({
    method: "POST",
    url: API_AUTH_FORGOT_PASSWORD,
    data: payload,
    skipAuth: true,
  });
  if (!result.ok) {
    return result;
  }
  const parsed = MessageResponseSchema.safeParse(result.data);
  if (!parsed.success) {
    return {
      ok: false,
      status: result.status,
      code: "INVALID_MESSAGE_RESPONSE",
      message: "Unexpected response shape.",
    };
  }
  return { ok: true, data: parsed.data, status: result.status };
}

export async function postResetPassword(
  http: HttpService,
  payload: ResetPasswordPayload,
): Promise<ApiResult<{ message: string }>> {
  const result = await http.request<unknown>({
    method: "POST",
    url: API_AUTH_RESET_PASSWORD,
    data: payload,
    skipAuth: true,
  });
  if (!result.ok) {
    return result;
  }
  const parsed = MessageResponseSchema.safeParse(result.data);
  if (!parsed.success) {
    return {
      ok: false,
      status: result.status,
      code: "INVALID_MESSAGE_RESPONSE",
      message: "Unexpected response shape.",
    };
  }
  return { ok: true, data: parsed.data, status: result.status };
}

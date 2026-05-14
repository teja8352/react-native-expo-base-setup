import type { AuthSession } from "types/auth.types";

import {
  STORAGE_KEY_LOCAL_AUTH_EMAIL,
  STORAGE_KEY_LOCAL_AUTH_PASSWORD,
  STORAGE_KEY_LOCAL_RESET_TOKEN,
  STORAGE_KEY_LOCAL_USER_ID,
} from "@/constants/storageKeys";

import type { SecureStorageService } from "../secureStorage";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function randomId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `local_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`;
}

function newLocalSession(user: { id: string; email: string }): AuthSession {
  const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  return {
    accessToken: `local_at_${suffix}`,
    refreshToken: `local_rt_${suffix}`,
    user,
  };
}

export async function localSecureRegister(
  secureStorage: SecureStorageService,
  email: string,
  password: string,
): Promise<{ session: AuthSession } | { error: string }> {
  const normalized = normalizeEmail(email);
  const existing = await secureStorage.getItem(STORAGE_KEY_LOCAL_AUTH_EMAIL);
  if (existing && normalizeEmail(existing) === normalized) {
    return { error: "An account already exists for this email. Sign in instead." };
  }
  const userId = randomId();
  const session = newLocalSession({ id: userId, email: email.trim() });
  await secureStorage.setItem(STORAGE_KEY_LOCAL_USER_ID, userId);
  await secureStorage.setItem(STORAGE_KEY_LOCAL_AUTH_EMAIL, email.trim());
  await secureStorage.setItem(STORAGE_KEY_LOCAL_AUTH_PASSWORD, password);
  await secureStorage.removeItem(STORAGE_KEY_LOCAL_RESET_TOKEN);
  return { session };
}

export async function localSecureLogin(
  secureStorage: SecureStorageService,
  email: string,
  password: string,
): Promise<{ session: AuthSession } | { error: string }> {
  const normalized = normalizeEmail(email);
  const storedEmail = await secureStorage.getItem(STORAGE_KEY_LOCAL_AUTH_EMAIL);
  const storedPassword = await secureStorage.getItem(STORAGE_KEY_LOCAL_AUTH_PASSWORD);
  if (!storedEmail || !storedPassword) {
    return { error: "No local account found. Register first (SecureStore mode)." };
  }
  if (normalizeEmail(storedEmail) !== normalized || storedPassword !== password) {
    return { error: "Invalid email or password." };
  }
  const userId = await secureStorage.getItem(STORAGE_KEY_LOCAL_USER_ID);
  if (!userId) {
    return { error: "Local account data is incomplete. Register again." };
  }
  const session = newLocalSession({ id: userId, email: storedEmail });
  return { session };
}

export async function localSecureRequestPasswordReset(
  secureStorage: SecureStorageService,
  email: string,
): Promise<{ message: string; resetToken: string } | { error: string }> {
  const normalized = normalizeEmail(email);
  const storedEmail = await secureStorage.getItem(STORAGE_KEY_LOCAL_AUTH_EMAIL);
  if (!storedEmail || normalizeEmail(storedEmail) !== normalized) {
    return {
      error: "No local account matches that email.",
    };
  }
  const resetToken = randomId();
  await secureStorage.setItem(STORAGE_KEY_LOCAL_RESET_TOKEN, resetToken);
  return {
    message: "Reset link ready (local mode). Opening reset password…",
    resetToken,
  };
}

export async function localSecureResetPassword(
  secureStorage: SecureStorageService,
  token: string,
  newPassword: string,
): Promise<{ message: string } | { error: string }> {
  const expected = await secureStorage.getItem(STORAGE_KEY_LOCAL_RESET_TOKEN);
  if (!expected || expected !== token.trim()) {
    return { error: "Invalid or expired reset token." };
  }
  await secureStorage.setItem(STORAGE_KEY_LOCAL_AUTH_PASSWORD, newPassword);
  await secureStorage.removeItem(STORAGE_KEY_LOCAL_RESET_TOKEN);
  return { message: "Password updated. You can sign in with your new password." };
}

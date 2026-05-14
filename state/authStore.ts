import * as authApi from "api/authApi";
import { router } from "expo-router";
import * as localSecureAuth from "services/auth/localSecureAuth";
import { authSession } from "services/authSession";
import { httpAuthBridge } from "services/http";
import type { SecureStorageService } from "services/secureStorage";
import type { AuthSession, AuthUser } from "types/auth.types";
import { create } from "zustand";

import { HREF_AUTH_LOGIN } from "@/constants";
import {
  STORAGE_KEY_ACCESS_TOKEN,
  STORAGE_KEY_REFRESH_TOKEN,
  STORAGE_KEY_USER_EMAIL,
  STORAGE_KEY_USER_ID,
} from "@/constants/storageKeys";

import { getAppServices } from "./serviceRegistry";

export type AuthStoreState = {
  user: AuthUser | null;
  hydrated: boolean;
  isRestoring: boolean;
  isAuthenticated: boolean;
};

export type AuthStoreActions = {
  hydrateFromStorage: () => Promise<void>;
  signInWithPassword: (
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  registerWithPassword: (
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (
    email: string,
  ) => Promise<
    { ok: true; message: string; resetToken?: string } | { ok: false; message: string }
  >;
  resetPassword: (
    token: string,
    password: string,
  ) => Promise<{ ok: true; message: string } | { ok: false; message: string }>;
};

export type AuthStore = AuthStoreState & AuthStoreActions;

async function persistSession(session: AuthSession, secureStorage: SecureStorageService) {
  await secureStorage.setItem(STORAGE_KEY_ACCESS_TOKEN, session.accessToken);
  await secureStorage.setItem(STORAGE_KEY_REFRESH_TOKEN, session.refreshToken);
  await secureStorage.setItem(STORAGE_KEY_USER_ID, session.user.id);
  await secureStorage.setItem(STORAGE_KEY_USER_EMAIL, session.user.email);
  authSession.setTokens({
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  });
}

async function clearPersistedSession(secureStorage: SecureStorageService) {
  await secureStorage.removeMany([
    STORAGE_KEY_ACCESS_TOKEN,
    STORAGE_KEY_REFRESH_TOKEN,
    STORAGE_KEY_USER_ID,
    STORAGE_KEY_USER_EMAIL,
  ]);
  authSession.clear();
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  hydrated: false,
  isRestoring: true,
  isAuthenticated: false,

  async hydrateFromStorage() {
    const { secureStorage, logger } = getAppServices();
    set({ isRestoring: true });
    try {
      const accessToken = await secureStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
      const refreshToken = await secureStorage.getItem(STORAGE_KEY_REFRESH_TOKEN);
      const userId = await secureStorage.getItem(STORAGE_KEY_USER_ID);
      const userEmail = await secureStorage.getItem(STORAGE_KEY_USER_EMAIL);
      if (accessToken && refreshToken && userId && userEmail) {
        authSession.setTokens({ accessToken, refreshToken });
        set({
          user: { id: userId, email: userEmail },
          isAuthenticated: true,
        });
        logger.info("Restored session from secure storage.");
      } else {
        set({ user: null, isAuthenticated: false });
        logger.info("No persisted session found.");
      }
    } catch (error) {
      logger.error("Failed to restore session", { error });
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ hydrated: true, isRestoring: false });
    }
  },

  async signInWithPassword(email, password) {
    const { http, secureStorage, logger, config } = getAppServices();
    if (config.AUTH_USE_HTTP) {
      const result = await authApi.postLogin(http, { email, password });
      if (!result.ok) {
        return { ok: false, message: result.message };
      }
      await persistSession(result.data, secureStorage);
      set({ user: result.data.user, isAuthenticated: true });
      logger.info("Signed in.");
      return { ok: true };
    }
    const local = await localSecureAuth.localSecureLogin(secureStorage, email, password);
    if ("error" in local) {
      return { ok: false, message: local.error };
    }
    await persistSession(local.session, secureStorage);
    set({ user: local.session.user, isAuthenticated: true });
    logger.info("Signed in (SecureStore mode).");
    return { ok: true };
  },

  async registerWithPassword(email, password) {
    const { http, secureStorage, logger, config } = getAppServices();
    if (config.AUTH_USE_HTTP) {
      const result = await authApi.postRegister(http, { email, password });
      if (!result.ok) {
        return { ok: false, message: result.message };
      }
      await persistSession(result.data, secureStorage);
      set({ user: result.data.user, isAuthenticated: true });
      logger.info("Registered and signed in.");
      return { ok: true };
    }
    const local = await localSecureAuth.localSecureRegister(secureStorage, email, password);
    if ("error" in local) {
      return { ok: false, message: local.error };
    }
    await persistSession(local.session, secureStorage);
    set({ user: local.session.user, isAuthenticated: true });
    logger.info("Registered and signed in (SecureStore mode).");
    return { ok: true };
  },

  async signOut() {
    const { http, secureStorage, logger, config } = getAppServices();
    if (config.AUTH_USE_HTTP) {
      try {
        const logoutResult = await authApi.postLogout(http);
        if (!logoutResult.ok) {
          logger.warn("Logout request failed", { message: logoutResult.message });
        }
      } catch (error) {
        logger.warn("Logout request threw", { error });
      }
    }
    await clearPersistedSession(secureStorage);
    set({ user: null, isAuthenticated: false });
    logger.info("Signed out.");
    router.replace(HREF_AUTH_LOGIN);
  },

  async requestPasswordReset(email) {
    const { http, secureStorage, config } = getAppServices();
    if (config.AUTH_USE_HTTP) {
      const result = await authApi.postForgotPassword(http, { email });
      if (!result.ok) {
        return { ok: false, message: result.message };
      }
      return { ok: true, message: result.data.message };
    }
    const local = await localSecureAuth.localSecureRequestPasswordReset(secureStorage, email);
    if ("error" in local) {
      return { ok: false, message: local.error };
    }
    return { ok: true, message: local.message, resetToken: local.resetToken };
  },

  async resetPassword(token, password) {
    const { http, secureStorage, config } = getAppServices();
    if (config.AUTH_USE_HTTP) {
      const result = await authApi.postResetPassword(http, { token, password });
      if (!result.ok) {
        return { ok: false, message: result.message };
      }
      return { ok: true, message: result.data.message };
    }
    const local = await localSecureAuth.localSecureResetPassword(
      secureStorage,
      token,
      password,
    );
    if ("error" in local) {
      return { ok: false, message: local.error };
    }
    return { ok: true, message: local.message };
  },
}));

httpAuthBridge.setSessionInvalidatedHandler(() => {
  void useAuthStore.getState().signOut();
});

import * as SecureStore from "expo-secure-store";

export type SecureStorageService = {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  removeMany(keys: readonly string[]): Promise<void>;
};

export function createSecureStorageService(): SecureStorageService {
  return {
    async setItem(key: string, value: string) {
      if (!(await SecureStore.isAvailableAsync())) {
        throw new Error("SecureStore is not available on this device.");
      }
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
    },
    async getItem(key: string) {
      if (!(await SecureStore.isAvailableAsync())) {
        return null;
      }
      return SecureStore.getItemAsync(key);
    },
    async removeItem(key: string) {
      if (!(await SecureStore.isAvailableAsync())) {
        return;
      }
      await SecureStore.deleteItemAsync(key);
    },
    async removeMany(keys: readonly string[]) {
      await Promise.all(keys.map((key) => this.removeItem(key)));
    },
  };
}

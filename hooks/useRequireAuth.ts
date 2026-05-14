import { useAuthStore } from "state/authStore";

export function useRequireAuth(): boolean {
  return useAuthStore((state) => state.isAuthenticated);
}

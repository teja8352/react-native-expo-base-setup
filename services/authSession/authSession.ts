let accessToken: string | null = null;
let refreshToken: string | null = null;

export const authSession = {
  setTokens(next: { accessToken: string | null; refreshToken: string | null }) {
    accessToken = next.accessToken;
    refreshToken = next.refreshToken;
  },
  getAccessToken(): string | null {
    return accessToken;
  },
  getRefreshToken(): string | null {
    return refreshToken;
  },
  clear() {
    accessToken = null;
    refreshToken = null;
  },
};

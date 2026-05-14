/**
 * Expo Router hrefs (typed routes when `experiments.typedRoutes` is enabled).
 * Prefer `router.push` / `router.replace` / `<Link href={...} />` with these constants.
 */
export const HREF_INDEX = "/";

export const HREF_AUTH_LOGIN = "/(auth)/login";
export const HREF_AUTH_REGISTER = "/(auth)/register";
export const HREF_AUTH_FORGOT_PASSWORD = "/(auth)/forgot-password";
export const HREF_AUTH_RESET_PASSWORD = "/(auth)/reset-password";

export const HREF_APP_TAB1 = "/(app)/(tabs)/tab1";
export const HREF_APP_TAB2 = "/(app)/(tabs)/tab2";
export const HREF_APP_TAB3 = "/(app)/(tabs)/tab3";
export const HREF_APP_TAB4 = "/(app)/(tabs)/tab4";

export const HREF_APP_MODAL = "/(app)/modal";

# RN-EXPO

Enterprise-oriented Expo (SDK 55) + React Native (TypeScript) foundation using **Expo Router** (file-based routing), **Zustand**, **Axios**, and a centralized service/bootstrap layer.

## Requirements

- Node.js LTS
- Xcode (iOS) / Android Studio (Android)

## First-time setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create environment files from the template:

   ```bash
   cp .env.example .env.development
   ```

   Adjust values for your API and bundle identifiers.

3. Install Husky hooks (once per clone):

   ```bash
   npm run prepare
   ```

## Scripts

| Script                 | Purpose                               |
| ---------------------- | ------------------------------------- |
| `npm run start`        | Start the Expo dev server             |
| `npm run android`      | Start targeting Android               |
| `npm run ios`          | Start targeting iOS                   |
| `npm run web`          | Start targeting web                   |
| `npm run lint`         | ESLint (zero warnings)                |
| `npm run lint:fix`     | ESLint with autofix                   |
| `npm run format`       | Prettier write                        |
| `npm run format:check` | Prettier check                        |
| `npm run typecheck`    | TypeScript `--noEmit`                 |
| `npm test`             | Jest                                  |
| `npm run clean`        | Remove `.expo` and Metro caches       |
| `npm run reset-cache`  | Start Expo with a cleared Metro cache |

## Architecture overview

- `app/`: Expo Router routes (`_layout.tsx`, groups, tabs, modal, `+not-found`)
- `src/startup/`: bootstrap logic, fatal startup UI (used by root `app/_layout.tsx`; not part of the Expo Router `app/` tree)
- `src/api/`: typed API clients (HTTP calls + Zod parsing)
- `src/components/`: reusable UI + layout + error boundaries
- `src/config/`: runtime configuration loading + validation (`zod`)
- `src/constants/`: href constants for Expo Router, timing, storage keys, shared literals
- `src/contexts/`: cross-cutting React contexts (services)
- `src/features/`: feature modules (expand here as the product grows)
- `src/hooks/`: reusable hooks
- `src/providers/`: top-level provider composition (no manual `NavigationContainer`)
- `src/router/`: small navigation-related helpers (e.g. shared stack `screenOptions`)
- `src/screens/`: screen implementations (each paired with a `*.styles.ts` file; imported by `app/` routes)
- `src/services/`: platform and infrastructure services (HTTP, logging, permissions, **expo-network** connectivity, etc.)
- `src/state/`: Zustand stores
- `src/store/`: barrel re-exports for store entry points
- `src/theme/`: design tokens + theme provider
- `src/types/`: shared domain types
- `src/utils/`: small pure helpers (keep lean)

## Authentication and navigation

- **Entry**: `package.json` → `"main": "expo-router/entry"`; `babel.config.js` uses `babel-preset-expo` (Expo Router is wired there in SDK 55) with the Reanimated Babel plugin **last**.
- **Public routes** (`app/(auth)/`): `login`, `register`, `forgot-password`, `reset-password` (stack + solid headers).
- **Private routes** (`app/(app)/`): nested **tabs** (`tab1`–`tab4`) each with its own **stack** (`index` screen), plus a **modal** example at `/(app)/modal`.
- **Guards**: group layouts use `Redirect` when the session state does not match the area.
- **APIs**: prefer `router.push` / `router.replace` / `router.back`, `<Link href={...} />`, and `useLocalSearchParams` (see `src/constants/routes.ts` for shared `HREF_*` values).
- **Deep linking**: configured via `scheme` in `app.config.ts` and Expo Router’s built-in integration (no manual `NavigationContainer` linking config).
- **Session restoration** reads **Expo SecureStore** on startup; in-memory session mirrors tokens for Axios interceptors.
- **HTTP `401`**: refresh once, then invalidate the session via the existing bridge (sign-out navigates with `router.replace`).

## Styling rules

- No Tailwind/NativeWind: **StyleSheet** only, typically via `useThemedStyles(() => createXStyles(theme))`
- Avoid hardcoded colors in product UI: prefer tokens from `src/theme`

## iOS UI stability

This template intentionally avoids translucent “glass” navigation materials and keeps headers and tab bars **opaque and predictable**.

## Environment configuration

`app.config.ts` loads:

1. `.env`
2. `.env.${APP_ENV}` (defaults to `development`)
3. `.env.local` (optional overrides)

`EXPO_PUBLIC_*` values are exposed to the client bundle. **Never** put secrets in `EXPO_PUBLIC_*`.

Production builds require a non-empty `EXPO_PUBLIC_API_BASE_URL` (validated in `src/config/runtimeConfig.schema.ts`).

## Testing

Jest is configured with `jest-expo`. Sample test: `__tests__/createAppTheme.test.ts`.

## Troubleshooting

- If Metro resolution acts odd after refactors: `npm run reset-cache`
- If native modules change: rebuild dev clients / run `npx expo prebuild` when you opt into prebuild workflows

# REACT-NATIVE-EXPO-BASE-SETUP

A scalable and production-ready Expo (SDK 55) + React Native (TypeScript) starter architecture built for real-world applications.

This project is designed to help teams build maintainable mobile applications using modern Expo-first practices, clean architecture principles, and a predictable developer workflow.

The stack is intentionally opinionated to reduce unnecessary complexity and improve long-term maintainability.

Core technologies used:

- Expo SDK 55
- React Native
- TypeScript
- Expo Router
- Zustand
- Axios
- Zod
- Jest
- ESLint + Prettier
- Husky

---

# Why this project exists

Many React Native projects become difficult to maintain over time because of:

- inconsistent folder structures
- navigation complexity
- scattered business logic
- untyped APIs
- poor environment handling
- direct pushes to production branches
- inconsistent coding practices

This repository tries to solve those issues by providing:

- a clean folder structure
- Expo-first architecture
- file-based routing with Expo Router
- centralized services and bootstrap layers
- consistent code standards
- scalable state management
- predictable Git workflows

The goal is to make onboarding easy for both experienced developers and freshers.

---

# Tech stack

| Technology   | Purpose             |
| ------------ | ------------------- |
| Expo SDK 55  | App framework       |
| React Native | Mobile UI framework |
| TypeScript   | Static typing       |
| Expo Router  | File-based routing  |
| Zustand      | State management    |
| Axios        | HTTP client         |
| Zod          | Runtime validation  |
| Jest         | Testing             |
| ESLint       | Code linting        |
| Prettier     | Code formatting     |
| Husky        | Git hooks           |

---

# Requirements

Before starting, ensure the following tools are installed on your machine.

## Required software

- Node.js LTS
- npm
- Git
- Xcode (for iOS development)
- Android Studio (for Android development)

Recommended:

- VS Code
- Expo Tools extension
- React Native Tools extension

---

# First-time setup

## 1. Clone the repository

```bash
git clone <repository-url>
```

Move into the project:

```bash
cd react-native-expo-base-setup
```

---

## 2. Install dependencies

```bash
npm install
```

This installs all project dependencies defined in `package.json`.

---

## 3. Create environment files

Copy the example environment file:

```bash
cp .env.example .env.development
```

Update values according to your environment.

Example:

```env
EXPO_PUBLIC_API_BASE_URL=https://api.example.com
```

Important:

- Only variables prefixed with `EXPO_PUBLIC_` are exposed to the app bundle
- Never store secrets in frontend environment files

Do not commit real environment files to Git.

---

## 4. Install Git hooks

Run:

```bash
npm run prepare
```

This installs Husky hooks which help enforce code quality before commits.

---

# Running the application

## Start the Expo development server

```bash
npm run start
```

---

## Run Android

```bash
npm run android
```

---

## Run iOS

```bash
npm run ios
```

---

## Run web version

```bash
npm run web
```

---

# Available scripts

| Script                 | Purpose                     |
| ---------------------- | --------------------------- |
| `npm run start`        | Start Expo dev server       |
| `npm run android`      | Start Android build         |
| `npm run ios`          | Start iOS build             |
| `npm run web`          | Start web build             |
| `npm run lint`         | Run ESLint                  |
| `npm run lint:fix`     | Auto-fix lint issues        |
| `npm run format`       | Format code using Prettier  |
| `npm run format:check` | Check formatting            |
| `npm run typecheck`    | Run TypeScript validation   |
| `npm test`             | Run tests                   |
| `npm run clean`        | Remove Expo + Metro cache   |
| `npm run reset-cache`  | Start Expo with clean cache |

---

# Project structure

The project follows a modular and scalable folder structure.

```txt
app/
src/
```

---

# app/ directory

The `app/` folder is used only for Expo Router route files.

Example:

```txt
app/
  _layout.tsx
  +not-found.tsx

  (auth)/
  (app)/
```

Important:

Only route-related files should exist here.

Do NOT place:

- services
- hooks
- utilities
- styles
- components
- stores
- API logic

inside `app/`.

Expo Router automatically treats files inside `app/` as routes.

---

# src/ directory

The `src/` folder contains the actual application implementation.

## Folder overview

### `src/api/`

Contains API clients and request logic.

Responsibilities:

- Axios instances
- API services
- request/response typing
- Zod validation

---

### `src/bootstrap/`

Contains application startup logic.

Responsibilities:

- app initialization
- startup checks
- session restoration
- global handlers

---

### `src/components/`

Reusable UI components shared across screens.

Examples:

- buttons
- loaders
- cards
- modals
- error boundaries

---

### `src/config/`

Application configuration and environment validation.

---

### `src/constants/`

Shared constants.

Examples:

- route names
- storage keys
- timeout values

---

### `src/features/`

Feature-based modules.

As the project grows, business logic should move here.

Example:

```txt
src/features/auth
src/features/profile
src/features/notifications
```

---

### `src/hooks/`

Reusable React hooks.

---

### `src/providers/`

Application-level provider composition.

Examples:

- theme provider
- query provider
- authentication provider

---

### `src/screens/`

Actual screen implementations.

Route files inside `app/` should stay minimal and simply import screens from here.

---

### `src/services/`

Platform and infrastructure services.

Examples:

- HTTP services
- logging
- analytics
- permissions
- network monitoring

---

### `src/state/`

Zustand stores and application state.

---

### `src/theme/`

Design system and theme tokens.

Includes:

- colors
- spacing
- typography
- shadows

---

### `src/types/`

Shared TypeScript types.

---

### `src/utils/`

Small reusable utility functions.

Keep this folder clean and focused.

---

# Navigation architecture

This project uses Expo Router instead of React Navigation setup.

Benefits:

- file-based routing
- simpler navigation
- easier deep linking
- less boilerplate
- better scalability

---

# Navigation rules

Use Expo Router APIs only.

Preferred APIs:

```tsx
router.push(...)
router.replace(...)
router.back(...)
```

Use links:

```tsx
<Link href="/profile" />
```

Avoid manual `NavigationContainer` setup.

---

# Authentication flow

Public routes:

```txt
app/(auth)/
```

Private routes:

```txt
app/(app)/
```

Route guards automatically redirect users depending on authentication state.

Session restoration uses Expo SecureStore.

---

# Deep linking

Deep linking is configured through:

```txt
app.config.ts
```

Expo Router handles linking automatically.

No manual linking configuration is needed.

---

# Styling guidelines

This project intentionally avoids Tailwind and NativeWind.

We use:

- React Native `StyleSheet`
- centralized theme tokens
- typed styles

Recommended pattern:

```tsx
useThemedStyles(() => createStyles(theme));
```

Avoid:

- hardcoded colors
- large inline styles
- duplicated spacing values

---

# State management

Global state uses Zustand.

Why Zustand:

- lightweight
- minimal boilerplate
- easy to scale
- TypeScript friendly

Keep stores focused and small.

Avoid massive global stores.

---

# Environment configuration

Environment loading order:

1. `.env`
2. `.env.${APP_ENV}`
3. `.env.local`

Example:

```txt
.env.development
.env.staging
.env.production
```

Never commit secrets.

---

# Notifications

Push notifications require a development build.

Expo Go has limitations for remote notifications.

Use:

```bash
npx expo run:ios
```

or

```bash
npx expo run:android
```

for proper testing.

---

# Git workflow

This repository follows a strict Pull Request workflow.

The `main` branch is protected.

Direct pushes to `main` are not allowed.

All changes must go through:

1. feature branch
2. Pull Request
3. review
4. approval
5. merge

---

# Branch naming conventions

## Feature branches

```txt
feature/<short-description>
```

Examples:

```txt
feature/auth-flow
feature/profile-screen
```

---

## Fix branches

```txt
fix/<short-description>
```

Examples:

```txt
fix/login-crash
fix/android-safe-area
```

---

## Refactor branches

```txt
refactor/<short-description>
```

---

## Chore branches

```txt
chore/<short-description>
```

---

# Rebase workflow (IMPORTANT)

This repository follows a rebase-first workflow.

We do NOT merge `main` into feature branches.

Before creating a Pull Request, always rebase your branch on top of the latest `main`.

---

# How to sync your branch correctly

## Step 1

Switch to main:

```bash
git checkout main
```

---

## Step 2

Pull latest changes:

```bash
git pull origin main
```

---

## Step 3

Switch back to your branch:

```bash
git checkout feature/my-feature
```

---

## Step 4

Rebase your branch:

```bash
git rebase main
```

---

## Step 5

Resolve conflicts if any.

Then continue:

```bash
git add .
git rebase --continue
```

---

## Step 6

Push updated branch:

```bash
git push --force-with-lease
```

---

# Why we use rebase

Rebase helps maintain:

- cleaner Git history
- easier debugging
- fewer merge commits
- simpler rollback
- cleaner Pull Requests

This makes the repository easier to maintain over time.

---

# Pull Request rules

Before creating a PR:

Run:

```bash
npm run lint
npm run typecheck
npm test
```

All checks must pass.

---

# PR expectations

Each PR should:

- solve one concern only
- include a meaningful title
- include screenshots for UI changes
- avoid unrelated formatting changes
- be rebased with latest `main`

---

# Commit message convention

We use Conventional Commits.

Format:

```txt
type(scope): message
```

Example:

```txt
feat(auth): add login persistence
fix(router): resolve redirect loop
refactor(theme): simplify tokens
```

---

# Allowed commit types

| Type       | Meaning                                              | Example                                  |
| ---------- | ---------------------------------------------------- | ---------------------------------------- |
| `feat`     | A new feature                                        | `feat: add dark mode support`            |
| `fix`      | A bug fix                                            | `fix: resolve login crash on Android`    |
| `refactor` | Code changes without changing behavior               | `refactor: simplify auth state handling` |
| `chore`    | Maintenance tasks, tooling, cleanup                  | `chore: update dependencies`             |
| `docs`     | Documentation changes only                           | `docs: add API setup instructions`       |
| `style`    | Formatting or UI style changes without logic changes | `style: format code with prettier`       |
| `test`     | Adding or updating tests                             | `test: add unit tests for theme hook`    |
| `perf`     | Performance improvements                             | `perf: optimize FlatList rendering`      |
| `build`    | Build system or dependency/build config changes      | `build: configure metro bundler aliases` |
| `ci`       | Continuous integration/deployment changes            | `ci: add GitHub Actions workflow`        |

---

# Testing

Testing uses Jest with `jest-expo`.

Run tests:

```bash
npm test
```

---

# Troubleshooting

## Reset Metro cache

```bash
npm run reset-cache
```

---

## Clear Expo cache

```bash
npm run clean
```

---

## Native dependency changes

If native modules change:

```bash
npx expo prebuild
```

or rebuild development clients.

---

# Security rules

Never commit:

- `.env`
- API keys
- secrets
- certificates
- build artifacts
- `.expo`
- `node_modules`

Use `.env.example` as the public template.

---

# Recommended GitHub repository settings

Enable:

- protected `main`
- required Pull Requests
- required approvals
- required status checks
- required branch updates
- conversation resolution
- linear history
- blocked force pushes on `main`

---

# Final notes

This repository is designed to be:

- scalable
- production-ready
- beginner-friendly
- team-friendly
- maintainable long term

When contributing:

- keep code simple
- prefer readability over cleverness
- write reusable components
- avoid unnecessary dependencies
- follow existing architecture patterns

Consistency matters more than personal preference.

Welcome to the project and happy coding.

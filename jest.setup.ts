import type { ReactNode } from "react";

// Intentionally minimal: add shared Jest setup here as the suite grows.

jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  return {
    router: { push, replace, back },
    useRouter: () => ({
      push,
      replace,
      back,
      canGoBack: jest.fn(() => false),
    }),
    useLocalSearchParams: () => ({}),
    useGlobalSearchParams: () => ({}),
    Link: ({ children }: { children: ReactNode }) => children,
    Redirect: () => null,
    Stack: Object.assign(({ children }: { children: ReactNode }) => children, {
      Screen: () => null,
    }),
    Tabs: Object.assign(({ children }: { children: ReactNode }) => children, {
      Screen: () => null,
    }),
    Slot: ({ children }: { children: ReactNode }) => children,
  };
});

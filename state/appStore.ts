import { create } from "zustand";

type AppStoreState = {
  isOnline: boolean;
};

type AppStoreActions = {
  setOnline: (value: boolean) => void;
};

export type AppStore = AppStoreState & AppStoreActions;

export const useAppStore = create<AppStore>((set) => ({
  isOnline: true,
  setOnline: (isOnline) => set({ isOnline }),
}));

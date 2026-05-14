import { create } from "zustand";

type UiStoreState = {
  isGlobalOverlayVisible: boolean;
};

type UiStoreActions = {
  setGlobalOverlayVisible: (value: boolean) => void;
};

export type UiStore = UiStoreState & UiStoreActions;

export const useUiStore = create<UiStore>((set) => ({
  isGlobalOverlayVisible: false,
  setGlobalOverlayVisible: (isGlobalOverlayVisible) => set({ isGlobalOverlayVisible }),
}));

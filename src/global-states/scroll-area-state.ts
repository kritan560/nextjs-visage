import { create } from "zustand";

interface ScrollAreaState {
  isScrolled: boolean;
  setScrolled: (bool: boolean) => void;
}

export const useGlobalScrollAreaState = create<ScrollAreaState>()((set) => ({
  isScrolled: false,
  setScrolled: (bool) => set({ isScrolled: bool }),
}));

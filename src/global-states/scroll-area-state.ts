import { create } from "zustand";

// interface ScrollAreaState {
//   isScrolled: boolean;
//   setScrolled: (bool: boolean) => void;
// }

// export const useGlobalScrollAreaState = create<ScrollAreaState>()((set) => ({
//   isScrolled: false,
//   setScrolled: (bool) => set({ isScrolled: bool }),
// }));

interface ScrollAreaPositionState {
  position: number;
  setPosition: (bool: number) => void;
}

export const useGlobalScrollAreaPositionState =
  create<ScrollAreaPositionState>()((set) => ({
    position: 0,
    setPosition: (value) => set({ position: value }),
  }));

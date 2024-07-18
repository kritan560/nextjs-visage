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
  position: { x: number; y: number };
  setPosition: (value: { x: number; y: number }) => void;
}

export const useGlobalScrollAreaPositionState =
  create<ScrollAreaPositionState>()((set) => ({
    position: { x: 0, y: 0 },
    setPosition: (value) => set({ position: value }),
  }));

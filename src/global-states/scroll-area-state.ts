import { create } from "zustand";

interface ScrollAreaPositionXState {
  position: { x: number };
  setPosition: (value: { x: number }) => void;
}

export const useGlobalScrollAreaPositionXState =
  create<ScrollAreaPositionXState>()((set) => ({
    position: { x: 0 },
    setPosition: (value) => set({ position: value }),
  }));

interface ScrollAreaPositionYState {
  position: { y: number };
  setPosition: (value: { y: number }) => void;
}

export const useGlobalScrollAreaPositionYState =
  create<ScrollAreaPositionYState>()((set) => ({
    position: { y: 0 },
    setPosition: (value) => set({ position: value }),
  }));

"use client";
import { create } from "zustand";

type UIState = {
  navScrolled: boolean;
  setNavScrolled: (v: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  navScrolled: false,
  setNavScrolled: (v) => set({ navScrolled: v }),
}));


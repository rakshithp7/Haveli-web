"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "@/data/menu";

export type CartLine = {
  id: string; // menu item id
  name: string;
  priceCents: number;
  qty: number;
};

type CartState = {
  lines: Record<string, CartLine>; // key by id
  add: (item: Pick<MenuItem, "id" | "name" | "priceCents">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  totalQuantity: number;
  subtotalCents: number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: {},
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.lines[item.id];
          const nextQty = (existing?.qty ?? 0) + qty;
          return {
            lines: {
              ...s.lines,
              [item.id]: {
                id: item.id,
                name: item.name,
                priceCents: item.priceCents,
                qty: nextQty,
              },
            },
          };
        }),
      remove: (id) => set((s) => ({ lines: Object.fromEntries(Object.entries(s.lines).filter(([k]) => k !== id)) })),
      setQty: (id, qty) =>
        set((s) => {
          const next = { ...s.lines };
          if (qty <= 0) delete next[id];
          else next[id] = { ...next[id], qty } as CartLine;
          return { lines: next };
        }),
      clear: () => set({ lines: {} }),
      get totalQuantity() {
        return Object.values(get().lines).reduce((a, l) => a + l.qty, 0);
      },
      get subtotalCents() {
        return Object.values(get().lines).reduce((a, l) => a + l.qty * l.priceCents, 0);
      },
    }),
    {
      name: "haveli-cart",
      version: 1,
      partialize: (s) => ({ lines: s.lines }),
    }
  )
);


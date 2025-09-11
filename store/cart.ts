'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MenuItem } from '@/data/menu';

// Helper to generate a unique cart item ID
function generateCartId(id: string, spiceLevel?: string, specialInstructions?: string): string {
  return `${id}__${spiceLevel || ''}__${specialInstructions || ''}`;
}

export type CartLine = {
  id: string; // menu item id
  cartId: string; // unique cart item identifier (combines id with customizations)
  name: string;
  priceCents: number;
  qty: number;
  spiceLevel?: string;
  specialInstructions?: string;
};

type CartState = {
  lines: Record<string, CartLine>; // key by cartId
  add: (
    item: Pick<MenuItem, 'id' | 'name' | 'priceCents'>,
    qty?: number,
    spiceLevel?: string,
    specialInstructions?: string
  ) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  totalQuantity: number;
  subtotalCents: number;
  // Helper to get quantity by base item id (summing all variations)
  getItemQuantity: (itemId: string) => number;
  // Helper to find all cart items by base item id
  findCartItemsByBaseId: (itemId: string) => CartLine[];
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: {},
      add: (item, qty = 1, spiceLevel, specialInstructions) =>
        set((s) => {
          // Generate a unique cart ID based on item ID and customizations
          const cartId = generateCartId(item.id, spiceLevel, specialInstructions);

          // Check if this exact item with these customizations exists
          const existing = s.lines[cartId];
          const nextQty = (existing?.qty ?? 0) + qty;

          return {
            lines: {
              ...s.lines,
              [cartId]: {
                id: item.id,
                cartId,
                name: item.name,
                priceCents: item.priceCents,
                qty: nextQty,
                spiceLevel,
                specialInstructions,
              },
            },
          };
        }),
      // Now using cartId instead of id
      remove: (cartId) =>
        set((s) => ({
          lines: Object.fromEntries(Object.entries(s.lines).filter(([k]) => k !== cartId)),
        })),

      setQty: (cartId, qty) =>
        set((s) => {
          const next = { ...s.lines };
          if (qty <= 0) delete next[cartId];
          else next[cartId] = { ...next[cartId], qty } as CartLine;
          return { lines: next };
        }),
      clear: () => set({ lines: {} }),
      get totalQuantity() {
        return Object.values(get().lines).reduce((a, l) => a + l.qty, 0);
      },
      get subtotalCents() {
        return Object.values(get().lines).reduce((a, l) => a + l.qty * l.priceCents, 0);
      },
      getItemQuantity: (itemId) => {
        return Object.values(get().lines)
          .filter((line) => line.id === itemId)
          .reduce((total, line) => total + line.qty, 0);
      },
      findCartItemsByBaseId: (itemId) => {
        return Object.values(get().lines).filter((line) => line.id === itemId);
      },
    }),
    {
      name: 'haveli-cart',
      version: 1,
      partialize: (s) => ({ lines: s.lines }),
      skipHydration: true, // Skip automatic hydration to avoid SSR/client mismatch
      storage: createJSONStorage(() => {
        // Check if window is defined (browser environment)
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Return a mock storage for SSR
        return {
          getItem: () => null,
          setItem: () => null,
          removeItem: () => null,
        };
      }),
    }
  )
);

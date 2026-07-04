'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRODUCTS } from './products';

export type CartItem = {
  id: number;
  vi: number;
  n: string;
  sp: string;
  ds: string;
  pr: number;
  q: number;
};

type CartStore = {
  cart: CartItem[];
  totalQty: () => number;
  totalPrice: () => number;
  getQty: (id: number, vi: number) => number;
  add: (id: number, vi: number) => void;
  adjust: (id: number, vi: number, delta: number) => void;
  remove: (id: number, vi: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      totalQty: () => get().cart.reduce((s, i) => s + i.q, 0),

      totalPrice: () => get().cart.reduce((s, i) => s + i.pr * i.q, 0),

      getQty: (id, vi) => {
        const item = get().cart.find(i => i.id === id && i.vi === vi);
        return item ? item.q : 0;
      },

      add: (id, vi) => {
        const p = PRODUCTS.find(p => p.id === id);
        if (!p || !p.variants[vi]) return;
        const v = p.variants[vi];
        set(s => {
          const existing = s.cart.find(i => i.id === id && i.vi === vi);
          if (existing) {
            return { cart: s.cart.map(i => i.id === id && i.vi === vi ? { ...i, q: i.q + 1 } : i) };
          }
          return { cart: [...s.cart, { id, vi, n: p.name, sp: v.sp, ds: v.ds, pr: v.pr, q: 1 }] };
        });
      },

      adjust: (id, vi, delta) => {
        set(s => {
          const next = s.cart
            .map(i => i.id === id && i.vi === vi ? { ...i, q: i.q + delta } : i)
            .filter(i => i.q > 0);
          return { cart: next };
        });
      },

      remove: (id, vi) => {
        set(s => ({ cart: s.cart.filter(i => !(i.id === id && i.vi === vi)) }));
      },

      clear: () => set({ cart: [] }),
    }),
    {
      name: 'abl_cart',
      skipHydration: false,
    }
  )
);

'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WishlistItem } from '@/lib/types';

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.find((i) => i.productId === item.productId))
            return state;
          return { items: [item, ...state.items] };
        });
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      toggleItem: (item) => {
        const exists = get().isInWishlist(item.productId);
        if (exists) get().removeItem(item.productId);
        else get().addItem(item);
      },

      isInWishlist: (productId) =>
        get().items.some((i) => i.productId === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'zahra-wishlist' }
  )
);

"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./cartTypes";
import {
  clearCartImages,
  deleteCartImage,
  getCartImageKey,
  saveCartImage,
} from "./cartImageStorage";

type CartDesignFile = {
  designId: string;
  file: File;
};

type CartStore = {
  cartItems: CartItem[];
  tempFiles: Record<string, File>;
  addItem: (item: Omit<CartItem, "id">, files?: CartDesignFile[]) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;

  isNavigating: boolean;
  startNav: () => void;
  stopNav: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      tempFiles: {},
      total: 0,

      addItem: (item, files = []) => {
        const newItem = {
          ...item,
          id: `${item.product ?? "product"}-${Date.now()}`,
          config: item.config
            ? {
                ...item.config,
                file: null,
                designs: (item.config.designs ?? []).map((design) => ({
                  ...design,
                  file: null,
                })),
              }
            : null,
        };
        const newCart = [...get().cartItems, newItem];
        const newTempFiles = { ...get().tempFiles };

        files.forEach(({ designId, file }) => {
          newTempFiles[getCartImageKey(newItem.id, designId)] = file;
        });
        void Promise.all(
          files.map(({ designId, file }) =>
            saveCartImage(newItem.id, file, designId),
          ),
        ).catch((error: unknown) =>
          console.error("Could not save product design files to cart:", error),
        );

        set({
          cartItems: newCart,
          tempFiles: newTempFiles,
          total: newCart.reduce((s, i) => s + (i.price ?? 0), 0),
        });
      },
      removeItem: (id) => {
        const newCart = get().cartItems.filter((i) => i.id !== id);
        const remainingFiles = { ...get().tempFiles };
        Object.keys(remainingFiles).forEach((key) => {
          if (key === id || key.startsWith(`${id}::`))
            delete remainingFiles[key];
        });
        void deleteCartImage(id).catch((error: unknown) =>
          console.error("Could not delete cart design files:", error),
        );
        set({
          cartItems: newCart,
          tempFiles: remainingFiles,
          total: newCart.reduce((s, i) => s + (i.price ?? 0), 0),
        });
      },

      clearCart: () => {
        void clearCartImages().catch((error: unknown) =>
          console.error("Could not clear cart design files:", error),
        );
        set({ cartItems: [], tempFiles: {}, total: 0 });
      },

      isNavigating: false,

      startNav: () => set({ isNavigating: true }),

      stopNav: () => set({ isNavigating: false }),
    }),
    {
      name: "gidrock-cart",
      partialize: (state) => ({
        cartItems: state.cartItems.map((item) => ({
          ...item,
          config: item.config
            ? {
                ...item.config,
                file: null,
                designs: (item.config.designs ?? []).map((design) => ({
                  ...design,
                  file: null,
                })),
              }
            : null,
        })),
        total: state.total,
      }),
      skipHydration: true,
    },
  ),
);

export function CartProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return children;
}

export function useCart() {
  return useCartStore();
}

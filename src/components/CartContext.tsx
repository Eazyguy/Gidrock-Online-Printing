"use client"

import { useEffect } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "./cartTypes"
import {
  clearCartImages,
  deleteCartImage,
  saveCartImage,
} from "./cartImageStorage"

type CartStore = {
  cartItems: CartItem[]
  tempFiles: Record<string, File>
  setTempFile: (itemId: string, file: File) => void
  addItem: (item: Omit<CartItem, "id">, file?: File) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get)=>({
      cartItems: [],
      tempFiles: {},
      total: 0,

      setTempFile: (itemId, file) => {
        void saveCartImage(itemId, file).catch(() => undefined)
        set((state) => ({
          tempFiles: {...state.tempFiles, [itemId]: file},
        }))
      },

      addItem: (item, file) => {
        const newItem = {
          ...item,
          id: `${item.product ?? "product"}-${Date.now()}`,
          config: item.config ? {...item.config, file: null} : null,
        }
        const newCart = [...get().cartItems, newItem]

        if (file) {
          void saveCartImage(newItem.id, file).catch(() => undefined)
        }

        set({
          cartItems: newCart,
          tempFiles: file
            ? {...get().tempFiles, [newItem.id]: file}
            : get().tempFiles,
          total: newCart.reduce((s, i) => s + (i.price ?? 0), 0),
        })
      },
      removeItem: (id) => {
        const newCart = get().cartItems.filter((i)=> i.id !== id)
        const remainingFiles = { ...get().tempFiles }
        delete remainingFiles[id]
        void deleteCartImage(id).catch(() => undefined)
        set({
          cartItems: newCart,
          tempFiles: remainingFiles,
          total: newCart.reduce((s, i)=> s + (i.price ?? 0), 0)
        })
      },

      clearCart: () => {
        void clearCartImages().catch(() => undefined)
        set({cartItems: [], tempFiles: {}, total: 0})
      }

    }),
    {
      name: 'gidrock-cart',
      partialize: (state) => ({
        cartItems: state.cartItems.map((item)=>({
          ...item,
          config: item.config ? {...item.config, file: null} : null
        })),
        total: state.total
      }),
      skipHydration: true
    }
  )
)  

export function CartProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useCartStore.persist.rehydrate()
  }, [])

  return children
}

export function useCart() {
  return useCartStore()
}
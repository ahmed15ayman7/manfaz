import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  type: 'service' | 'delivery'|"product"
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage'
    }
  )
)

export default useCartStore
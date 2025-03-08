import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/interfaces'

interface CartItem {
  id: string
  type: 'service' | 'delivery' | 'product'
  quantity: number
  product?: Product
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  getItemQuantity: (id: string) => number
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(i => i.id === item.id)
        
        if (existingItem) {
          set({
            items: items.map(i => 
              i.id === item.id 
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          })
        } else {
          set({ items: [...items, item] })
        }
      },
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      })),
      getItemQuantity: (id) => {
        const item = get().items.find(item => item.id === id)
        return item?.quantity || 0
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          if (item.product) {
            const price = item.product.discountPrice || item.product.price
            return total + (price * item.quantity)
          }
          return total
        }, 0)
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)

export default useCartStore
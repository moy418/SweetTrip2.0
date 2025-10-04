import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem } from '../types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getItemQuantity: (productId: string) => number
  isInCart: (productId: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        const items = get().items
        const existingItem = items.find(item => item.product_id === product.id)
        
        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: items.map(item =>
              item.product_id === product.id
                ? { 
                    ...item, 
                    quantity: Math.min(item.quantity + quantity, 99) // Max 99 items
                  }
                : item
            )
          })
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            product_id: product.id,
            product,
            quantity: Math.min(quantity, 99),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          set({
            items: [...items, newItem]
          })
        }
      },
      
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.product_id !== productId)
        })
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.product_id === productId
              ? { 
                  ...item, 
                  quantity: Math.min(quantity, 99),
                  updated_at: new Date().toISOString()
                }
              : item
          )
        })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + (item.product.price * item.quantity)
        }, 0)
      },
      
      getItemQuantity: (productId) => {
        const item = get().items.find(item => item.product_id === productId)
        return item ? item.quantity : 0
      },
      
      isInCart: (productId) => {
        return get().items.some(item => item.product_id === productId)
      },
    }),
    {
      name: 'sweettrip-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)


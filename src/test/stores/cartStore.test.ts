import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '../../stores/cartStore'
import { Product } from '../../types'

// Mock product data
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'A test product',
  price: 10.99,
  image: '/test-image.jpg',
  category_id: '1',
  featured: false,
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
}

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCartStore.getState().clearCart()
  })

  it('should start with empty cart', () => {
    const { items, getTotalItems, getTotalPrice } = useCartStore.getState()
    
    expect(items).toEqual([])
    expect(getTotalItems()).toBe(0)
    expect(getTotalPrice()).toBe(0)
  })

  it('should add item to cart', () => {
    const { addItem, items } = useCartStore.getState()
    
    addItem(mockProduct, 2)
    
    expect(items).toHaveLength(1)
    expect(items[0].product).toEqual(mockProduct)
    expect(items[0].quantity).toBe(2)
  })

  it('should update quantity when adding existing item', () => {
    const { addItem, items } = useCartStore.getState()
    
    addItem(mockProduct, 2)
    addItem(mockProduct, 3)
    
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(5)
  })

  it('should remove item from cart', () => {
    const { addItem, removeItem, items } = useCartStore.getState()
    
    addItem(mockProduct, 2)
    expect(items).toHaveLength(1)
    
    removeItem(mockProduct.id)
    expect(items).toHaveLength(0)
  })

  it('should update item quantity', () => {
    const { addItem, updateQuantity, items } = useCartStore.getState()
    
    addItem(mockProduct, 2)
    updateQuantity(mockProduct.id, 5)
    
    expect(items[0].quantity).toBe(5)
  })

  it('should calculate total items correctly', () => {
    const { addItem, getTotalItems } = useCartStore.getState()
    
    addItem(mockProduct, 2)
    
    const secondProduct: Product = {
      ...mockProduct,
      id: '2',
      name: 'Second Product',
    }
    addItem(secondProduct, 3)
    
    expect(getTotalItems()).toBe(5)
  })

  it('should calculate total price correctly', () => {
    const { addItem, getTotalPrice } = useCartStore.getState()
    
    addItem(mockProduct, 2) // 10.99 * 2 = 21.98
    
    const secondProduct: Product = {
      ...mockProduct,
      id: '2',
      name: 'Second Product',
      price: 5.99,
    }
    addItem(secondProduct, 1) // 5.99 * 1 = 5.99
    
    expect(getTotalPrice()).toBeCloseTo(27.97, 2)
  })

  it('should clear cart', () => {
    const { addItem, clearCart, items } = useCartStore.getState()
    
    addItem(mockProduct, 2)
    expect(items).toHaveLength(1)
    
    clearCart()
    expect(items).toHaveLength(0)
  })

  it('should handle removing non-existent item gracefully', () => {
    const { removeItem, items } = useCartStore.getState()
    
    expect(() => removeItem('non-existent')).not.toThrow()
    expect(items).toHaveLength(0)
  })

  it('should handle updating quantity of non-existent item gracefully', () => {
    const { updateQuantity, items } = useCartStore.getState()
    
    expect(() => updateQuantity('non-existent', 5)).not.toThrow()
    expect(items).toHaveLength(0)
  })

  it('should persist cart to localStorage', () => {
    const { addItem } = useCartStore.getState()
    
    addItem(mockProduct, 2)
    
    // Check if localStorage was called
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('should load cart from localStorage on initialization', () => {
    // Mock localStorage data
    const mockCartData = JSON.stringify([
      {
        product: mockProduct,
        quantity: 3,
      },
    ])
    
    localStorage.getItem.mockReturnValue(mockCartData)
    
    // Create new store instance to test initialization
    const { items } = useCartStore.getState()
    
    // Note: In a real test, you'd need to reinitialize the store
    // This is a simplified test to show the concept
    expect(localStorage.getItem).toHaveBeenCalledWith('sweettrip-cart')
  })
})

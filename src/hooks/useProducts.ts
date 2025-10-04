import { useState, useEffect } from 'react'
import { ProductService, ProductFilters } from '../services/productService'
import { Product } from '../types'

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  totalCount: number
}

export const useProducts = (filters: ProductFilters = {}): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load products and count in parallel
      const [productsData, count] = await Promise.all([
        ProductService.getProducts(filters),
        ProductService.getProductCount(filters)
      ])

      setProducts(productsData)
      setTotalCount(count)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products'
      setError(errorMessage)
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [JSON.stringify(filters)]) // Re-run when filters change

  const refetch = async () => {
    await loadProducts()
  }

  return {
    products,
    loading,
    error,
    refetch,
    totalCount
  }
}

interface UseProductReturn {
  product: Product | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useProduct = (id: string): UseProductReturn => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      const productData = await ProductService.getProductById(id)
      setProduct(productData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load product'
      setError(errorMessage)
      console.error('Error loading product:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  const refetch = async () => {
    await loadProduct()
  }

  return {
    product,
    loading,
    error,
    refetch
  }
}

interface UseFeaturedProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useFeaturedProducts = (limit: number = 6): UseFeaturedProductsReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const featuredProducts = await ProductService.getFeaturedProducts(limit)
      setProducts(featuredProducts)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load featured products'
      setError(errorMessage)
      console.error('Error loading featured products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeaturedProducts()
  }, [limit])

  const refetch = async () => {
    await loadFeaturedProducts()
  }

  return {
    products,
    loading,
    error,
    refetch
  }
}

export default useProducts

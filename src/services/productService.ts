import { supabase } from '../lib/supabase'
import { Product } from '../types'

export interface ProductFilters {
  category?: string
  featured?: boolean
  search?: string
  minPrice?: number
  maxPrice?: number
  status?: 'active' | 'inactive' | 'draft'
  limit?: number
  offset?: number
}

export class ProductService {
  /**
   * Get all products with optional filters
   */
  static async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category)
      }

      if (filters.featured !== undefined) {
        query = query.eq('featured', filters.featured)
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice)
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice)
      }

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching products:', error)
        throw new Error(`Failed to fetch products: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('ProductService.getProducts error:', error)
      throw error
    }
  }

  /**
   * Get a single product by ID
   */
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Product not found
        }
        console.error('Error fetching product:', error)
        throw new Error(`Failed to fetch product: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('ProductService.getProductById error:', error)
      throw error
    }
  }

  /**
   * Get a product by handle (slug)
   */
  static async getProductByHandle(handle: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('handle', handle)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Product not found
        }
        console.error('Error fetching product by handle:', error)
        throw new Error(`Failed to fetch product: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('ProductService.getProductByHandle error:', error)
      throw error
    }
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    return this.getProducts({ featured: true, limit })
  }

  /**
   * Search products by name or description
   */
  static async searchProducts(searchTerm: string, limit: number = 20): Promise<Product[]> {
    return this.getProducts({ search: searchTerm, limit })
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(categoryId: string, limit: number = 20): Promise<Product[]> {
    return this.getProducts({ category: categoryId, limit })
  }

  /**
   * Get product count for pagination
   */
  static async getProductCount(filters: ProductFilters = {}): Promise<number> {
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Apply same filters as getProducts
      if (filters.category) {
        query = query.eq('category_id', filters.category)
      }

      if (filters.featured !== undefined) {
        query = query.eq('featured', filters.featured)
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice)
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice)
      }

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      const { count, error } = await query

      if (error) {
        console.error('Error getting product count:', error)
        throw new Error(`Failed to get product count: ${error.message}`)
      }

      return count || 0
    } catch (error) {
      console.error('ProductService.getProductCount error:', error)
      throw error
    }
  }

  /**
   * Get related products based on category and tags
   */
  static async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    try {
      // First get the current product to find related ones
      const currentProduct = await this.getProductById(productId)
      if (!currentProduct) return []

      // Get products from same category
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('category_id', currentProduct.category_id)
        .neq('id', productId)
        .limit(limit)

      if (error) {
        console.error('Error fetching related products:', error)
        throw new Error(`Failed to fetch related products: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('ProductService.getRelatedProducts error:', error)
      throw error
    }
  }
}

export default ProductService

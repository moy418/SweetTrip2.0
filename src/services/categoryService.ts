import { supabase } from '../lib/supabase'

export interface Category {
  id: number
  name: string
  description: string | null
  slug: string
  image_url: string | null
  is_active: boolean
  is_world_cup_special: boolean
  display_order: number
}

export class CategoryService {
  /**
   * Get all active categories
   */
  static async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error fetching categories:', error)
        throw new Error(`Failed to fetch categories: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('CategoryService.getCategories error:', error)
      throw error
    }
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Category not found
        }
        console.error('Error fetching category:', error)
        throw new Error(`Failed to fetch category: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('CategoryService.getCategoryBySlug error:', error)
      throw error
    }
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: number): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Category not found
        }
        console.error('Error fetching category:', error)
        throw new Error(`Failed to fetch category: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('CategoryService.getCategoryById error:', error)
      throw error
    }
  }

  /**
   * Map category names to slugs for URL routing
   */
  static getCategorySlug(categoryName: string): string {
    const categoryMap: Record<string, string> = {
      'HALLOWEEN': 'halloween',
      'CHOCOLATE': 'chocolate',
      'COOKIES': 'cookies',
      'CHIPS': 'chips',
      'SWEETS': 'sweets',
      'SPICY': 'spicy',
      'DRINKS': 'drinks',
      'ALL PRODUCTS': 'all-products',
      'FEATURED': 'featured'
    }

    return categoryMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-')
  }

  /**
   * Map category slugs to names for display
   */
  static getCategoryName(slug: string): string {
    const nameMap: Record<string, string> = {
      'halloween': 'HALLOWEEN',
      'chocolate': 'CHOCOLATE',
      'cookies': 'COOKIES',
      'chips': 'CHIPS',
      'sweets': 'SWEETS',
      'spicy': 'SPICY',
      'drinks': 'DRINKS',
      'all-products': 'ALL PRODUCTS',
      'featured': 'FEATURED'
    }

    return nameMap[slug] || slug.toUpperCase().replace(/-/g, ' ')
  }
}

export default CategoryService

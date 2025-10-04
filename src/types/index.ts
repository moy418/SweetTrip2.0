// Core Types
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  compare_price?: number
  currency: string
  sku?: string
  weight_grams?: number
  origin_country?: string
  brand?: string
  vendor?: string
  image_urls: string[]
  category_id?: string
  tags: string[]
  stock_quantity: number
  is_active: boolean
  featured: boolean
  status: 'active' | 'inactive' | 'draft'
  handle: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  slug: string
  image_url?: string
  parent_id?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  role: 'customer' | 'admin' | 'super_admin'
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  product_id: string
  product: Product
  quantity: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  currency: string
  shipping_amount: number
  tax_amount: number
  discount_amount: number
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method?: string
  stripe_payment_intent_id?: string
  shipping_address?: Address
  billing_address?: Address
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product: Product
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface Address {
  first_name: string
  last_name: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
}

export interface Coupon {
  id: string
  code: string
  description?: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  minimum_order_amount?: number
  usage_limit?: number
  times_used: number
  expires_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  title?: string
  comment?: string
  verified_purchase: boolean
  user: {
    name: string
    avatar_url?: string
  }
  created_at: string
  updated_at: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Filter and Search Types
export interface ProductFilters {
  category_id?: string
  price_min?: number
  price_max?: number
  brand?: string
  origin_country?: string
  in_stock?: boolean
  featured?: boolean
  search?: string
  sort_by?: 'name' | 'price' | 'created_at' | 'popularity'
  sort_order?: 'asc' | 'desc'
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  first_name: string
  last_name: string
  phone?: string
}

export interface CheckoutForm {
  email: string
  first_name: string
  last_name: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
  shipping_address_same: boolean
  billing_first_name?: string
  billing_last_name?: string
  billing_company?: string
  billing_address1?: string
  billing_address2?: string
  billing_city?: string
  billing_state?: string
  billing_zip?: string
  billing_country?: string
  billing_phone?: string
}

// World Cup 2026 Types (Coming Soon)
export interface WorldCupFeature {
  id: string
  title: string
  description: string
  status: 'coming_soon' | 'active'
  launch_date?: string
}

// Notification Types
export interface Notification {
  id: string
  user_id: string
  type: 'order' | 'promotion' | 'system'
  title: string
  message: string
  data?: Record<string, any>
  is_read: boolean
  created_at: string
}

// Language Types
export interface Language {
  code: string
  name: string
  flag: string
  is_active: boolean
}

// Site Settings
export interface SiteSettings {
  site_name: string
  site_description: string
  currency: string
  shipping_free_threshold: number
  tax_rate: number
  featured_products_limit: number
  contact_email: string
  contact_phone: string
  social_links: {
    facebook?: string
    instagram?: string
    twitter?: string
    tiktok?: string
  }
}


// Environment Configuration
export const config = {
  // Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo_key',
  },
  
  // Stripe
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    secretKey: import.meta.env.STRIPE_SECRET_KEY,
  },
  
  // EmailJS
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  },
  
  // App
  app: {
    url: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
    name: import.meta.env.VITE_APP_NAME || 'SweetTrip',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'International Candy E-commerce Platform',
  },
  
  // Environment
  env: import.meta.env.NODE_ENV || 'development',
  isDevelopment: import.meta.env.NODE_ENV === 'development',
  isProduction: import.meta.env.NODE_ENV === 'production',
} as const

// Validation function to check if all required environment variables are present
export const validateConfig = () => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_STRIPE_PUBLISHABLE_KEY',
  ]
  
  const missing = required.filter(key => !import.meta.env[key])
  
  // For demo purposes, don't throw error if missing
  if (missing.length > 0 && import.meta.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

// Site Settings
export const siteSettings = {
  currency: 'USD',
  currencySymbol: '$',
  shippingFreeThreshold: 60,
  taxRate: 0.08,
  featuredProductsLimit: 6,
  itemsPerPage: 12,
  maxCartItems: 99,
  supportedCountries: [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'MX', name: 'Mexico' },
    { code: 'ES', name: 'Spain' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'IT', name: 'Italy' },
    { code: 'GB', name: 'United Kingdom' },
  ],
  defaultCountry: 'US',
  supportedLanguages: [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ],
  defaultLanguage: 'en',
} as const

// API Endpoints
export const apiEndpoints = {
  products: '/api/products',
  categories: '/api/categories',
  orders: '/api/orders',
  users: '/api/users',
  auth: '/api/auth',
  cart: '/api/cart',
  checkout: '/api/checkout',
  reviews: '/api/reviews',
  coupons: '/api/coupons',
} as const

// Local Storage Keys
export const storageKeys = {
  cart: 'sweettrip-cart',
  user: 'sweettrip-user',
  language: 'sweettrip-language',
  theme: 'sweettrip-theme',
} as const

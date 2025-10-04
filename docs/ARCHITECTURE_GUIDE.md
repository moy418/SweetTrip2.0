# SweetTrip E-commerce - Architecture & Clean Code Guide

## 🎯 Project Overview

**SweetTrip** is a modern, secure e-commerce platform for international candy sales. This guide provides a complete blueprint for rebuilding the application with clean architecture, security best practices, and maintainable code.

## 🏗️ Current Architecture Analysis

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: Zustand + React Context
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe
- **Deployment**: Docker + Nginx

### Security Issues Identified
- Hardcoded API keys in source code
- Missing environment variable validation
- Insecure authentication patterns
- No input sanitization
- Missing CSRF protection
- Inadequate error handling

## 🚀 Clean Architecture Proposal

### 1. Project Structure

```
sweettrip-clean/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components (Button, Input, etc.)
│   │   ├── layout/          # Layout components (Header, Footer, etc.)
│   │   ├── forms/           # Form components
│   │   └── features/        # Feature-specific components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services and external integrations
│   ├── stores/              # State management (Zustand stores)
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── constants/           # Application constants
│   ├── config/              # Configuration files
│   └── lib/                 # Third-party library configurations
├── public/                  # Static assets
├── docs/                    # Documentation
└── tests/                   # Test files
```

### 2. Core Components Structure

#### UI Components (`src/components/ui/`)
```typescript
// Base components with consistent API
- Button.tsx
- Input.tsx
- Card.tsx
- Modal.tsx
- Toast.tsx
- LoadingSpinner.tsx
- ErrorBoundary.tsx
```

#### Layout Components (`src/components/layout/`)
```typescript
- Header.tsx
- Footer.tsx
- Sidebar.tsx
- Navigation.tsx
- Breadcrumbs.tsx
```

#### Feature Components (`src/components/features/`)
```typescript
// Product-related
- ProductCard.tsx
- ProductGrid.tsx
- ProductFilters.tsx
- ProductSearch.tsx

// Cart-related
- CartItem.tsx
- CartSummary.tsx
- CartDrawer.tsx

// User-related
- UserProfile.tsx
- LoginForm.tsx
- RegisterForm.tsx

// Order-related
- OrderSummary.tsx
- OrderHistory.tsx
- CheckoutForm.tsx
```

### 3. Services Layer (`src/services/`)

#### API Services
```typescript
// api/
- supabase.ts          # Supabase client configuration
- stripe.ts            # Stripe client configuration
- auth.ts              # Authentication service
- products.ts          # Product API calls
- orders.ts            # Order API calls
- users.ts             # User API calls

// external/
- emailService.ts      # Email notifications
- analyticsService.ts  # Analytics tracking
- storageService.ts    # File storage
```

#### Service Pattern Example
```typescript
// src/services/api/products.ts
export class ProductService {
  private supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
      
      if (error) throw new Error(error.message)
      return data || []
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    // Implementation
  }

  async createProduct(product: CreateProductDto): Promise<Product> {
    // Implementation with validation
  }
}

export const productService = new ProductService()
```

### 4. State Management (`src/stores/`)

#### Zustand Stores
```typescript
// cartStore.ts
interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

// authStore.ts
interface AuthStore {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

// uiStore.ts
interface UIStore {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  cartOpen: boolean
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  toggleCart: () => void
}
```

### 5. Type Definitions (`src/types/`)

```typescript
// api.ts
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

// product.ts
export interface Product {
  id: number
  name: string
  description: string
  price: number
  currency: string
  category_id: number
  sku: string
  stock_quantity: number
  weight_grams: number
  origin_country: string
  brand: string
  image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// user.ts
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  created_at: string
  updated_at: string
}

// order.ts
export interface Order {
  id: number
  user_id: string
  status: OrderStatus
  total_amount: number
  currency: string
  shipping_address: Address
  billing_address: Address
  items: OrderItem[]
  created_at: string
  updated_at: string
}
```

### 6. Configuration (`src/config/`)

#### Environment Configuration
```typescript
// env.ts
export const config = {
  supabase: {
    url: process.env.VITE_SUPABASE_URL!,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!
  },
  stripe: {
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY!,
    secretKey: process.env.STRIPE_SECRET_KEY!
  },
  app: {
    name: 'SweetTrip',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development'
  }
}

// Validate required environment variables
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_STRIPE_PUBLISHABLE_KEY'
]

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
})
```

### 7. Security Implementation

#### Input Validation
```typescript
// src/utils/validation.ts
import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  price: z.number().positive(),
  category_id: z.number().positive(),
  stock_quantity: z.number().min(0),
  weight_grams: z.number().positive().optional(),
  origin_country: z.string().min(2).max(50),
  brand: z.string().min(1).max(50)
})

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50)
})
```

#### Sanitization
```typescript
// src/utils/sanitize.ts
import DOMPurify from 'dompurify'

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html)
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}
```

#### Error Handling
```typescript
// src/utils/errorHandler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error
  }
  
  if (error instanceof Error) {
    return new AppError(error.message, 500, false)
  }
  
  return new AppError('An unknown error occurred', 500, false)
}
```

### 8. Custom Hooks (`src/hooks/`)

```typescript
// useAuth.ts
export const useAuth = () => {
  const { user, profile, isLoading, signIn, signOut } = useAuthStore()
  
  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut
  }
}

// useProducts.ts
export const useProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await productService.getProducts(filters)
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters])

  return { products, loading, error, refetch: () => fetchProducts() }
}

// useCart.ts
export const useCart = () => {
  const cartStore = useCartStore()
  
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    if (product.stock_quantity < quantity) {
      throw new Error('Insufficient stock')
    }
    cartStore.addItem(product, quantity)
  }, [cartStore])

  return {
    items: cartStore.items,
    totalItems: cartStore.getTotalItems(),
    totalPrice: cartStore.getTotalPrice(),
    addToCart,
    removeFromCart: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    clearCart: cartStore.clearCart
  }
}
```

### 9. Page Components (`src/pages/`)

```typescript
// HomePage.tsx
export const HomePage = () => {
  const { products, loading, error } = useProducts({ featured: true })
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  
  return (
    <div className="container mx-auto px-4">
      <HeroSection />
      <FeaturedProducts products={products} />
      <CategoriesSection />
    </div>
  )
}

// ProductListPage.tsx
export const ProductListPage = () => {
  const [filters, setFilters] = useState<ProductFilters>({})
  const { products, loading, error } = useProducts(filters)
  
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <ProductFilters filters={filters} onFiltersChange={setFilters} />
        </aside>
        <main className="lg:col-span-3">
          <ProductGrid products={products} loading={loading} error={error} />
        </main>
      </div>
    </div>
  )
}
```

### 10. Environment Variables

```bash
# .env.example
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Application Configuration
VITE_APP_NAME=SweetTrip
VITE_APP_VERSION=2.0.0
NODE_ENV=development

# Email Configuration (Optional)
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### 11. Package.json Dependencies

```json
{
  "name": "sweettrip-clean",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "@supabase/supabase-js": "^2.56.1",
    "@stripe/stripe-js": "^7.9.0",
    "@stripe/react-stripe-js": "^3.9.2",
    "zustand": "^5.0.8",
    "zod": "^3.24.1",
    "react-hook-form": "^7.54.2",
    "@hookform/resolvers": "^3.10.0",
    "dompurify": "^3.2.2",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "lucide-react": "^0.364.0",
    "react-hot-toast": "^2.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/dompurify": "^3.2.0",
    "@typescript-eslint/eslint-plugin": "^8.15.0",
    "@typescript-eslint/parser": "^8.15.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.15.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.14",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "typescript": "~5.6.2",
    "vite": "^6.0.1"
  }
}
```

### 12. Security Checklist

#### Environment Security
- [ ] All sensitive data in environment variables
- [ ] No hardcoded API keys or secrets
- [ ] Environment variable validation on startup
- [ ] Different configs for dev/staging/production

#### Input Security
- [ ] Input validation with Zod schemas
- [ ] HTML sanitization with DOMPurify
- [ ] SQL injection prevention (Supabase handles this)
- [ ] XSS protection

#### Authentication Security
- [ ] Secure password requirements
- [ ] JWT token validation
- [ ] Session management
- [ ] CSRF protection

#### Data Security
- [ ] Row Level Security (RLS) in Supabase
- [ ] API rate limiting
- [ ] Data encryption in transit
- [ ] Secure file uploads

### 13. Performance Optimizations

#### Code Splitting
```typescript
// Lazy load heavy components
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
```

#### Image Optimization
```typescript
// Use optimized image components
import { LazyImage } from '@/components/ui/LazyImage'

<LazyImage
  src={product.image_url}
  alt={product.name}
  width={300}
  height={300}
  loading="lazy"
/>
```

#### Caching Strategy
```typescript
// Implement caching for API calls
const useProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}
```

### 14. Testing Strategy

#### Unit Tests
```typescript
// __tests__/utils/validation.test.ts
import { productSchema } from '@/utils/validation'

describe('Product Validation', () => {
  it('should validate correct product data', () => {
    const validProduct = {
      name: 'Test Product',
      description: 'Test Description',
      price: 10.99,
      category_id: 1,
      stock_quantity: 100
    }
    
    expect(() => productSchema.parse(validProduct)).not.toThrow()
  })
})
```

#### Integration Tests
```typescript
// __tests__/services/productService.test.ts
import { productService } from '@/services/api/products'

describe('ProductService', () => {
  it('should fetch products successfully', async () => {
    const products = await productService.getProducts()
    expect(Array.isArray(products)).toBe(true)
  })
})
```

### 15. Deployment Configuration

#### Docker Configuration
```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration
```nginx
# nginx.conf
server {
    listen 80;
    server_name sweettripcandy.com www.sweettripcandy.com;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🚀 Migration Steps

### Phase 1: Setup Clean Architecture
1. Create new project structure
2. Set up TypeScript configuration
3. Configure Tailwind CSS
4. Set up Vite with optimizations

### Phase 2: Core Components
1. Build base UI components
2. Implement layout components
3. Create feature components
4. Set up routing

### Phase 3: Services & State
1. Implement API services
2. Set up Zustand stores
3. Create custom hooks
4. Add error handling

### Phase 4: Security & Validation
1. Implement input validation
2. Add sanitization
3. Set up authentication
4. Configure environment variables

### Phase 5: Testing & Deployment
1. Write unit tests
2. Add integration tests
3. Set up CI/CD pipeline
4. Deploy to production

## 📚 Additional Resources

- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

This architecture guide provides a solid foundation for rebuilding SweetTrip with clean, secure, and maintainable code. Each component is designed to be testable, reusable, and following modern React patterns.

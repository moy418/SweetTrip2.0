# SweetTrip E-commerce - Clean Architecture Guide

## 🎯 Project Overview

**SweetTrip** is a modern, secure e-commerce platform for international candy sales. This repository contains comprehensive documentation for rebuilding the application with clean architecture, security best practices, and maintainable code.

## 📚 Documentation Structure

### Core Documentation
- **[ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md)** - Complete architecture blueprint and technical specifications
- **[COMPONENT_REFERENCE.md](./COMPONENT_REFERENCE.md)** - Detailed component analysis and clean implementation examples
- **[SECURITY_GUIDE.md](./SECURITY_GUIDE.md)** - Security vulnerabilities and implementation guide
- **[MIGRATION_ROADMAP.md](./MIGRATION_ROADMAP.md)** - Step-by-step migration plan with timeline

### Quick Start
- **[README.md](./README.md)** - Original project documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions
- **[STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md)** - Payment integration guide

## 🚨 Current Issues Identified

### Security Vulnerabilities
- ❌ **Hardcoded API keys** in source code
- ❌ **Missing input validation** on user inputs
- ❌ **XSS vulnerabilities** from unsanitized content
- ❌ **Weak authentication** patterns
- ❌ **No CSRF protection**
- ❌ **Inadequate error handling**

### Architecture Problems
- ❌ **Mixed concerns** in components
- ❌ **Inconsistent prop interfaces**
- ❌ **No proper error boundaries**
- ❌ **Missing loading states**
- ❌ **Inconsistent styling approaches**
- ❌ **No proper type safety**

### Performance Issues
- ❌ **Large bundle sizes** (1.5MB+)
- ❌ **No code splitting**
- ❌ **Unoptimized images**
- ❌ **No caching strategy**
- ❌ **Inefficient re-renders**

## 🏗️ Clean Architecture Proposal

### Tech Stack
```typescript
// Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Zustand (state management)
- React Router (routing)
- React Hook Form (forms)
- Zod (validation)

// Backend
- Supabase (PostgreSQL + Auth + Storage)
- Stripe (payments)
- Row Level Security (RLS)

// Development
- ESLint + Prettier (code quality)
- Vitest (testing)
- Playwright (E2E testing)
- Docker (containerization)
```

### Project Structure
```
sweettrip-clean/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Form components
│   │   └── features/        # Feature-specific components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services
│   ├── stores/              # State management
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   ├── constants/           # Application constants
│   ├── config/              # Configuration
│   └── lib/                 # Third-party configs
├── public/                  # Static assets
├── docs/                    # Documentation
└── tests/                   # Test files
```

## 🔒 Security Implementation

### Environment Security
```typescript
// ✅ SECURE - Environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!

// ❌ INSECURE - Hardcoded values
const supabaseUrl = 'https://pmqcegwfucfbwwmwumkk.supabase.co'
```

### Input Validation
```typescript
// ✅ SECURE - Zod validation
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  description: z.string().max(1000)
})

const handleSubmit = (data: unknown) => {
  const validatedData = productSchema.parse(data)
  createProduct(validatedData)
}
```

### XSS Protection
```typescript
// ✅ SECURE - HTML sanitization
import DOMPurify from 'dompurify'

const sanitizedHtml = DOMPurify.sanitize(userInput)
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
```

## 🎨 Component Architecture

### Base UI Components
```typescript
// src/components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  loading?: boolean
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner size="sm" className="mr-2" />}
        {children}
      </button>
    )
  }
)
```

### Feature Components
```typescript
// src/components/features/products/ProductCard.tsx
interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onViewDetails: (product: Product) => void
  isLoading?: boolean
}

export const ProductCard = ({ product, onAddToCart, onViewDetails, isLoading }: ProductCardProps) => {
  if (isLoading) return <ProductCardSkeleton />
  
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        <LazyImage
          src={product.image_url}
          alt={product.name}
          className="object-cover group-hover:scale-105 transition-transform"
        />
        {product.stock_quantity === 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">Out of Stock</Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            {product.origin_country}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(product)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={product.stock_quantity === 0}
            className="flex-1"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

## 🔧 State Management

### Zustand Store
```typescript
// src/stores/cartStore.ts
interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id)
          
          if (existingItem) {
            return {
              items: state.items.map(item => 
                item.product.id === product.id 
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            }
          } else {
            return {
              items: [...state.items, { product, quantity }]
            }
          }
        })
      },
      // ... other methods
    }),
    {
      name: 'sweet-trip-cart'
    }
  )
)
```

### Custom Hooks
```typescript
// src/hooks/useProducts.ts
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
```

## 🚀 Migration Strategy

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup and configuration
- [ ] TypeScript and Tailwind setup
- [ ] Core dependencies installation
- [ ] Basic project structure

### Phase 2: Infrastructure (Week 3-4)
- [ ] Type system implementation
- [ ] Validation schemas
- [ ] Utility functions
- [ ] Error handling system

### Phase 3: UI Components (Week 5-6)
- [ ] Base UI components
- [ ] Layout components
- [ ] Form components
- [ ] Feature components

### Phase 4: Services & State (Week 7-8)
- [ ] API services
- [ ] State management
- [ ] Custom hooks
- [ ] Authentication

### Phase 5: Pages & Routing (Week 9-10)
- [ ] Page components
- [ ] Routing configuration
- [ ] Protected routes
- [ ] Navigation

### Phase 6: Security (Week 11-12)
- [ ] Authentication security
- [ ] Database security
- [ ] API security
- [ ] Input validation

### Phase 7: Testing (Week 13-14)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Security tests
- [ ] E2E tests

### Phase 8: Deployment (Week 15-16)
- [ ] Build configuration
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Environment configuration

### Phase 9: Monitoring (Week 17-18)
- [ ] Performance monitoring
- [ ] Security monitoring
- [ ] Error tracking
- [ ] Analytics

### Phase 10: Documentation (Week 19-20)
- [ ] Technical documentation
- [ ] User documentation
- [ ] Team training
- [ ] Maintenance plan

## 📊 Success Metrics

### Technical Metrics
- **Performance**: Lighthouse score > 90
- **Security**: Zero critical vulnerabilities
- **Accessibility**: WCAG AA compliance
- **SEO**: Core Web Vitals all green
- **Code Quality**: ESLint score > 95%

### Business Metrics
- **User Experience**: Reduced bounce rate
- **Conversion**: Improved checkout completion
- **Performance**: Faster page load times
- **Security**: Zero security incidents
- **Maintainability**: Reduced bug reports

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- pnpm or npm
- Git
- Docker (optional)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/sweettrip-clean.git
cd sweettrip-clean

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
pnpm dev
```

### Environment Variables
```bash
# .env.example
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NODE_ENV=development
```

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### E2E Tests
```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests in headed mode
pnpm test:e2e:headed
```

### Security Tests
```bash
# Run security audit
pnpm audit

# Run dependency check
pnpm audit:fix
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t sweettrip-clean .

# Run container
docker run -p 80:80 sweettrip-clean
```

### Production Build
```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

### Security Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://react.dev/learn/security)
- [Supabase Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### Performance Resources
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write comprehensive tests
- Document your code
- Follow security guidelines

### Pull Request Process
1. Ensure all tests pass
2. Update documentation if needed
3. Request review from team members
4. Address feedback
5. Merge after approval

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- Check the [documentation](./docs/)
- Search [existing issues](https://github.com/your-org/sweettrip-clean/issues)
- Create a [new issue](https://github.com/your-org/sweettrip-clean/issues/new)
- Contact the development team

### Reporting Issues
When reporting issues, please include:
- Description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Screenshots (if applicable)

## 🎯 Roadmap

### Short Term (Next 3 months)
- [ ] Complete migration to clean architecture
- [ ] Implement comprehensive security measures
- [ ] Achieve 90+ Lighthouse score
- [ ] Complete test coverage
- [ ] Deploy to production

### Medium Term (3-6 months)
- [ ] Add advanced features
- [ ] Implement analytics
- [ ] Optimize performance
- [ ] Expand test coverage
- [ ] Improve documentation

### Long Term (6+ months)
- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Machine learning features
- [ ] International expansion
- [ ] Enterprise features

---

**Note**: This is a comprehensive guide for rebuilding SweetTrip with clean architecture, security best practices, and maintainable code. Follow the migration roadmap for a systematic approach to the rebuild process.

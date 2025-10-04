# SweetTrip Component Reference Guide

## 📋 Current Components Analysis

This document provides a comprehensive reference of all existing components in the SweetTrip application, their purposes, and recommendations for the clean rebuild.

## 🏗️ Component Structure

### Layout Components

#### Header.tsx
**Purpose**: Main navigation header with logo, menu, and cart
**Current Issues**:
- Complex dropdown logic
- Hardcoded navigation items
- Mixed concerns (auth, cart, navigation)
**Clean Version**:
```typescript
// src/components/layout/Header.tsx
interface HeaderProps {
  user?: User | null
  cartItems: number
  onCartClick: () => void
  onMenuToggle: () => void
}

export const Header = ({ user, cartItems, onCartClick, onMenuToggle }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <Navigation />
          <HeaderActions user={user} cartItems={cartItems} onCartClick={onCartClick} />
        </div>
      </div>
    </header>
  )
}
```

#### Footer.tsx
**Purpose**: Site footer with links and information
**Clean Version**:
```typescript
// src/components/layout/Footer.tsx
export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FooterSection title="SweetTrip" links={companyLinks} />
          <FooterSection title="Products" links={productLinks} />
          <FooterSection title="Support" links={supportLinks} />
          <FooterSection title="Connect" links={socialLinks} />
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; 2024 SweetTrip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
```

### Product Components

#### ProductCard.tsx
**Purpose**: Display individual product information
**Current Issues**:
- Mixed styling approaches
- Inconsistent prop interfaces
- No loading states
**Clean Version**:
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

#### ProductGrid.tsx
**Purpose**: Display grid of products with loading states
**Clean Version**:
```typescript
// src/components/features/products/ProductGrid.tsx
interface ProductGridProps {
  products: Product[]
  loading: boolean
  error?: string | null
  onProductClick: (product: Product) => void
  onAddToCart: (product: Product) => void
}

export const ProductGrid = ({ products, loading, error, onProductClick, onAddToCart }: ProductGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (products.length === 0) {
    return <EmptyState message="No products found" />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onProductClick}
        />
      ))}
    </div>
  )
}
```

### Cart Components

#### CartDrawer.tsx
**Purpose**: Sidebar cart with items and checkout
**Clean Version**:
```typescript
// src/components/features/cart/CartDrawer.tsx
interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemoveItem: (productId: number) => void
  onCheckout: () => void
}

export const CartDrawer = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }: CartDrawerProps) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Shopping Cart ({totalItems} items)</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>
        
        <DrawerBody>
          {items.length === 0 ? (
            <EmptyState message="Your cart is empty" />
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>
          )}
        </DrawerBody>
        
        {items.length > 0 && (
          <DrawerFooter>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            <Button onClick={onCheckout} className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}
```

### Form Components

#### CheckoutForm.tsx
**Purpose**: Checkout form with payment processing
**Clean Version**:
```typescript
// src/components/features/checkout/CheckoutForm.tsx
interface CheckoutFormProps {
  cartItems: CartItem[]
  onSuccess: (order: Order) => void
  onError: (error: string) => void
}

export const CheckoutForm = ({ cartItems, onSuccess, onError }: CheckoutFormProps) => {
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  })

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const order = await orderService.createOrder({
        ...data,
        items: cartItems
      })
      onSuccess(order)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Checkout failed')
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Contact Information">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More form fields */}
      </FormSection>

      <FormSection title="Shipping Address">
        {/* Address fields */}
      </FormSection>

      <FormSection title="Payment">
        <StripePaymentForm />
      </FormSection>

      <Button type="submit" className="w-full" size="lg">
        Complete Order
      </Button>
    </form>
  )
}
```

### UI Components

#### Button.tsx
**Purpose**: Reusable button component
**Clean Version**:
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

#### Input.tsx
**Purpose**: Reusable input component
**Clean Version**:
```typescript
// src/components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    )
  }
)
```

### Page Components

#### HomePage.tsx
**Purpose**: Landing page with hero and featured products
**Clean Version**:
```typescript
// src/pages/HomePage.tsx
export const HomePage = () => {
  const { products: featuredProducts, loading } = useProducts({ featured: true, limit: 8 })
  const { products: newProducts } = useProducts({ sort: 'newest', limit: 4 })

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Hand-picked treats from around the world</p>
          </div>
          
          <ProductGrid
            products={featuredProducts}
            loading={loading}
            onProductClick={(product) => navigate(`/products/${product.id}`)}
            onAddToCart={(product) => addToCart(product)}
          />
          
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
            <p className="text-lg text-gray-600">Fresh treats just added to our collection</p>
          </div>
          
          <ProductGrid
            products={newProducts}
            loading={loading}
            onProductClick={(product) => navigate(`/products/${product.id}`)}
            onAddToCart={(product) => addToCart(product)}
          />
        </div>
      </section>

      <FeaturesSection />
    </div>
  )
}
```

#### ProductDetailPage.tsx
**Purpose**: Individual product page with details and purchase options
**Clean Version**:
```typescript
// src/pages/ProductDetailPage.tsx
export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { product, loading, error } = useProduct(Number(id))
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!product) return <NotFoundPage />

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast.success('Added to cart!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.name, href: `/products/${product.id}` }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden">
            <LazyImage
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{product.description}</p>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
              <Badge variant="outline">{product.origin_country}</Badge>
              <Badge variant="outline">{product.brand}</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="quantity">Quantity:</Label>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: Math.min(product.stock_quantity, 10) }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="flex-1"
                size="lg"
              >
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
            </div>

            {product.stock_quantity === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Out of Stock</AlertTitle>
                <AlertDescription>
                  This product is currently out of stock. Check back soon!
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Weight:</span> {product.weight_grams}g
              </div>
              <div>
                <span className="font-medium">SKU:</span> {product.sku}
              </div>
              <div>
                <span className="font-medium">Origin:</span> {product.origin_country}
              </div>
              <div>
                <span className="font-medium">Brand:</span> {product.brand}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 🔧 Utility Components

#### LoadingSpinner.tsx
```typescript
// src/components/ui/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-primary', sizeClasses[size], className)} />
  )
}
```

#### ErrorMessage.tsx
```typescript
// src/components/ui/ErrorMessage.tsx
interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  )
}
```

#### EmptyState.tsx
```typescript
// src/components/ui/EmptyState.tsx
interface EmptyStateProps {
  message: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = ({ message, description, action }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {action}
    </div>
  )
}
```

## 📱 Responsive Design Patterns

#### Mobile-First Approach
```typescript
// Example: Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Content */}
</div>

// Example: Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>

// Example: Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  {/* Content */}
</div>
```

#### Touch-Friendly Design
```typescript
// Minimum 44px touch targets
<Button className="min-h-[44px] min-w-[44px]">
  Touch Target
</Button>

// Adequate spacing between interactive elements
<div className="space-y-4">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</div>
```

## 🎨 Styling Guidelines

#### Color System
```typescript
// Use semantic color names
const colors = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-gray-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white'
}
```

#### Spacing System
```typescript
// Consistent spacing scale
const spacing = {
  xs: 'space-y-1',    // 4px
  sm: 'space-y-2',    // 8px
  md: 'space-y-4',    // 16px
  lg: 'space-y-6',    // 24px
  xl: 'space-y-8',    // 32px
  '2xl': 'space-y-12' // 48px
}
```

#### Typography Scale
```typescript
// Consistent text sizes
const textSizes = {
  xs: 'text-xs',      // 12px
  sm: 'text-sm',      // 14px
  base: 'text-base',  // 16px
  lg: 'text-lg',      // 18px
  xl: 'text-xl',      // 20px
  '2xl': 'text-2xl',  // 24px
  '3xl': 'text-3xl',  // 30px
  '4xl': 'text-4xl'   // 36px
}
```

## 🧪 Testing Components

#### Component Testing Example
```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '@/components/features/products/ProductCard'

const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'Test Description',
  price: 10.99,
  image_url: 'test.jpg',
  stock_quantity: 10
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} onViewDetails={jest.fn()} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$10.99')).toBeInTheDocument()
  })

  it('calls onAddToCart when add button is clicked', () => {
    const onAddToCart = jest.fn()
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} onViewDetails={jest.fn()} />)
    
    fireEvent.click(screen.getByText('Add to Cart'))
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct)
  })
})
```

This component reference provides a comprehensive guide for rebuilding the SweetTrip application with clean, maintainable, and secure components. Each component follows modern React patterns, includes proper TypeScript typing, and implements best practices for accessibility, performance, and user experience.

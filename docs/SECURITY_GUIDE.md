# SweetTrip Security Implementation Guide

## 🛡️ Security Overview

This guide outlines the security vulnerabilities in the current SweetTrip application and provides a comprehensive plan for implementing secure practices in the clean rebuild.

## 🚨 Current Security Issues

### 1. Hardcoded Credentials
**Issue**: API keys and sensitive data are hardcoded in source code
```typescript
// ❌ CURRENT - INSECURE
const supabaseUrl = 'https://pmqcegwfucfbwwmwumkk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Solution**: Use environment variables
```typescript
// ✅ SECURE
const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!
```

### 2. Missing Input Validation
**Issue**: No validation on user inputs
```typescript
// ❌ CURRENT - VULNERABLE
const handleSubmit = (data: any) => {
  // Direct use without validation
  createProduct(data)
}
```

**Solution**: Implement Zod validation
```typescript
// ✅ SECURE
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

### 3. XSS Vulnerabilities
**Issue**: User input rendered without sanitization
```typescript
// ❌ CURRENT - VULNERABLE
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

**Solution**: Sanitize all user input
```typescript
// ✅ SECURE
import DOMPurify from 'dompurify'

const sanitizedHtml = DOMPurify.sanitize(userInput)
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
```

### 4. Insecure Authentication
**Issue**: Weak password requirements and session management
```typescript
// ❌ CURRENT - INSECURE
const signUp = async (email: string, password: string) => {
  // No password strength validation
  await supabase.auth.signUp({ email, password })
}
```

**Solution**: Implement strong authentication
```typescript
// ✅ SECURE
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain special character')

const signUp = async (email: string, password: string) => {
  const validatedPassword = passwordSchema.parse(password)
  await supabase.auth.signUp({ 
    email, 
    password: validatedPassword,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })
}
```

## 🔒 Security Implementation Plan

### 1. Environment Security

#### Environment Variable Validation
```typescript
// src/config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development')
})

export const env = envSchema.parse(process.env)

// Validate on startup
if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing required environment variables')
}
```

#### Secure Configuration
```typescript
// src/config/security.ts
export const securityConfig = {
  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  
  // Session management
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    refreshThreshold: 60 * 60 * 1000, // 1 hour
    secure: process.env.NODE_ENV === 'production'
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // requests per window
  },
  
  // CORS settings
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://sweettripcandy.com'] 
      : ['http://localhost:3000'],
    credentials: true
  }
}
```

### 2. Input Validation & Sanitization

#### Validation Schemas
```typescript
// src/schemas/validation.ts
import { z } from 'zod'

// User schemas
export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().regex(/^\+?[\d\s-()]+$/).optional()
})

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

// Product schemas
export const productSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  price: z.number().positive('Price must be positive'),
  category_id: z.number().positive(),
  stock_quantity: z.number().min(0),
  weight_grams: z.number().positive().optional(),
  origin_country: z.string().min(2).max(50),
  brand: z.string().min(1).max(50),
  sku: z.string().min(1).max(50)
})

// Order schemas
export const orderSchema = z.object({
  items: z.array(z.object({
    product_id: z.number().positive(),
    quantity: z.number().positive()
  })).min(1),
  shipping_address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip_code: z.string().min(1),
    country: z.string().min(2)
  }),
  billing_address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip_code: z.string().min(1),
    country: z.string().min(2)
  })
})

// Search schemas
export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  filters: z.object({
    category: z.number().positive().optional(),
    price_min: z.number().min(0).optional(),
    price_max: z.number().min(0).optional(),
    origin_country: z.string().optional()
  }).optional()
})
```

#### Sanitization Utilities
```typescript
// src/utils/sanitize.ts
import DOMPurify from 'dompurify'

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  })
}

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
}

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}

export const sanitizeUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol')
    }
    return parsedUrl.toString()
  } catch {
    return ''
  }
}
```

### 3. Authentication & Authorization

#### Secure Authentication Service
```typescript
// src/services/auth.ts
import { supabase } from '@/config/supabase'
import { userRegistrationSchema, userLoginSchema } from '@/schemas/validation'
import { AppError } from '@/utils/errorHandler'

export class AuthService {
  async signUp(data: unknown) {
    try {
      const validatedData = userRegistrationSchema.parse(data)
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            first_name: validatedData.firstName,
            last_name: validatedData.lastName,
            phone: validatedData.phone
          }
        }
      })

      if (error) throw new AppError(error.message, 400)
      return authData
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError('Invalid input data', 400)
      }
      throw error
    }
  }

  async signIn(data: unknown) {
    try {
      const validatedData = userLoginSchema.parse(data)
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password
      })

      if (error) throw new AppError('Invalid credentials', 401)
      return authData
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError('Invalid input data', 400)
      }
      throw error
    }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw new AppError(error.message, 500)
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    if (error) throw new AppError(error.message, 500)
  }

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) throw new AppError(error.message, 500)
  }
}

export const authService = new AuthService()
```

#### Authorization Middleware
```typescript
// src/middleware/auth.ts
import { supabase } from '@/config/supabase'
import { AppError } from '@/utils/errorHandler'

export const requireAuth = async (): Promise<User> => {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new AppError('Authentication required', 401)
  }
  
  return user
}

export const requireAdmin = async (): Promise<User> => {
  const user = await requireAuth()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!profile || profile.role !== 'admin') {
    throw new AppError('Admin access required', 403)
  }
  
  return user
}

export const requireOwnership = async (resourceUserId: string): Promise<User> => {
  const user = await requireAuth()
  
  if (user.id !== resourceUserId) {
    throw new AppError('Access denied', 403)
  }
  
  return user
}
```

### 4. API Security

#### Secure API Client
```typescript
// src/services/api/client.ts
import { supabase } from '@/config/supabase'
import { AppError } from '@/utils/errorHandler'

export class ApiClient {
  private async handleResponse<T>(response: any): Promise<T> {
    if (response.error) {
      throw new AppError(response.error.message, response.error.status || 500)
    }
    return response.data
  }

  async get<T>(table: string, options?: any): Promise<T> {
    const response = await supabase
      .from(table)
      .select(options?.select || '*')
      .eq(options?.eq?.field, options?.eq?.value)
      .limit(options?.limit || 100)
    
    return this.handleResponse<T>(response)
  }

  async post<T>(table: string, data: any): Promise<T> {
    const response = await supabase
      .from(table)
      .insert(data)
      .select()
      .single()
    
    return this.handleResponse<T>(response)
  }

  async put<T>(table: string, id: number, data: any): Promise<T> {
    const response = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    return this.handleResponse<T>(response)
  }

  async delete<T>(table: string, id: number): Promise<T> {
    const response = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .select()
      .single()
    
    return this.handleResponse<T>(response)
  }
}

export const apiClient = new ApiClient()
```

#### Rate Limiting
```typescript
// src/middleware/rateLimit.ts
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private windowMs: number
  private maxRequests: number

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    return true
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []
    const validRequests = requests.filter(time => now - time < this.windowMs)
    return Math.max(0, this.maxRequests - validRequests.length)
  }
}

export const rateLimiter = new RateLimiter()
```

### 5. Database Security

#### Row Level Security (RLS) Policies
```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Products: Public read, admin write
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products are editable by admins" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Orders: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

#### Secure Database Functions
```sql
-- Function to safely create orders
CREATE OR REPLACE FUNCTION create_order(
  order_items jsonb,
  shipping_address jsonb,
  billing_address jsonb
) RETURNS orders AS $$
DECLARE
  new_order orders;
  item record;
  product_record products;
BEGIN
  -- Validate user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Create the order
  INSERT INTO orders (user_id, shipping_address, billing_address, status)
  VALUES (auth.uid(), shipping_address, billing_address, 'pending')
  RETURNING * INTO new_order;

  -- Add order items and validate stock
  FOR item IN SELECT * FROM jsonb_to_recordset(order_items) AS x(product_id int, quantity int)
  LOOP
    -- Get product and check stock
    SELECT * INTO product_record FROM products WHERE id = item.product_id;
    
    IF product_record IS NULL THEN
      RAISE EXCEPTION 'Product not found: %', item.product_id;
    END IF;
    
    IF product_record.stock_quantity < item.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for product: %', product_record.name;
    END IF;
    
    -- Add order item
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (new_order.id, item.product_id, item.quantity, product_record.price);
    
    -- Update stock
    UPDATE products 
    SET stock_quantity = stock_quantity - item.quantity
    WHERE id = item.product_id;
  END LOOP;
  
  RETURN new_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 6. Payment Security

#### Secure Stripe Integration
```typescript
// src/services/payments.ts
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement } from '@stripe/react-stripe-js'
import { orderSchema } from '@/schemas/validation'

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY!)

export class PaymentService {
  async createPaymentIntent(orderData: unknown) {
    try {
      const validatedOrder = orderSchema.parse(orderData)
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(validatedOrder)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }
      
      return await response.json()
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError('Invalid order data', 400)
      }
      throw error
    }
  }

  async confirmPayment(paymentIntentId: string) {
    const stripe = await stripePromise
    if (!stripe) throw new Error('Stripe not loaded')
    
    const { error } = await stripe.confirmPayment({
      clientSecret: paymentIntentId,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`
      }
    })
    
    if (error) throw new AppError(error.message, 400)
  }

  private async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new AppError('Authentication required', 401)
    return session.access_token
  }
}

export const paymentService = new PaymentService()
```

### 7. File Upload Security

#### Secure File Upload
```typescript
// src/services/upload.ts
import { supabase } from '@/config/supabase'
import { sanitizeFilename } from '@/utils/sanitize'

export class UploadService {
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  private readonly maxSize = 5 * 1024 * 1024 // 5MB

  async uploadFile(file: File, bucket: string, path: string): Promise<string> {
    // Validate file type
    if (!this.allowedTypes.includes(file.type)) {
      throw new AppError('Invalid file type', 400)
    }

    // Validate file size
    if (file.size > this.maxSize) {
      throw new AppError('File too large', 400)
    }

    // Sanitize filename
    const sanitizedFilename = sanitizeFilename(file.name)
    const fullPath = `${path}/${sanitizedFilename}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw new AppError(error.message, 500)

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fullPath)

    return urlData.publicUrl
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw new AppError(error.message, 500)
  }
}

export const uploadService = new UploadService()
```

### 8. Error Handling & Logging

#### Secure Error Handling
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
  
  if (error instanceof z.ZodError) {
    return new AppError('Validation error', 400)
  }
  
  if (error instanceof Error) {
    // Don't expose internal error details in production
    if (process.env.NODE_ENV === 'production') {
      return new AppError('Internal server error', 500, false)
    }
    return new AppError(error.message, 500, false)
  }
  
  return new AppError('An unknown error occurred', 500, false)
}

// Global error handler
export const globalErrorHandler = (error: unknown) => {
  const appError = handleError(error)
  
  // Log error (implement proper logging service)
  console.error('Application Error:', {
    message: appError.message,
    statusCode: appError.statusCode,
    stack: appError.stack,
    timestamp: new Date().toISOString()
  })
  
  return appError
}
```

### 9. Security Headers

#### Nginx Security Headers
```nginx
# nginx.conf
server {
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com https://*.supabase.co; frame-src https://js.stripe.com;" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Remove server information
    server_tokens off;
    
    # Hide nginx version
    more_clear_headers 'Server';
}
```

### 10. Security Testing

#### Security Test Suite
```typescript
// __tests__/security/auth.test.ts
import { authService } from '@/services/auth'
import { AppError } from '@/utils/errorHandler'

describe('Authentication Security', () => {
  it('should reject weak passwords', async () => {
    const weakPassword = '123456'
    
    await expect(
      authService.signUp({
        email: 'test@example.com',
        password: weakPassword,
        firstName: 'Test',
        lastName: 'User'
      })
    ).rejects.toThrow(AppError)
  })

  it('should sanitize user input', async () => {
    const maliciousInput = '<script>alert("xss")</script>'
    
    await expect(
      authService.signUp({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: maliciousInput,
        lastName: 'User'
      })
    ).rejects.toThrow()
  })
})

// __tests__/security/validation.test.ts
import { productSchema } from '@/schemas/validation'

describe('Input Validation', () => {
  it('should reject SQL injection attempts', () => {
    const maliciousInput = "'; DROP TABLE products; --"
    
    expect(() => {
      productSchema.parse({
        name: maliciousInput,
        description: 'Test',
        price: 10,
        category_id: 1,
        stock_quantity: 100
      })
    }).toThrow()
  })

  it('should reject XSS attempts', () => {
    const xssInput = '<script>alert("xss")</script>'
    
    expect(() => {
      productSchema.parse({
        name: xssInput,
        description: 'Test',
        price: 10,
        category_id: 1,
        stock_quantity: 100
      })
    }).toThrow()
  })
})
```

## 🔍 Security Checklist

### Development Phase
- [ ] Environment variables properly configured
- [ ] Input validation implemented
- [ ] XSS protection enabled
- [ ] CSRF protection implemented
- [ ] SQL injection prevention
- [ ] Authentication security
- [ ] Authorization checks
- [ ] Rate limiting implemented
- [ ] Error handling secure
- [ ] Logging implemented

### Testing Phase
- [ ] Security tests written
- [ ] Penetration testing performed
- [ ] Vulnerability scanning
- [ ] Code review completed
- [ ] Dependency audit
- [ ] SSL/TLS configuration
- [ ] Security headers configured
- [ ] Database security verified

### Production Phase
- [ ] Environment variables secured
- [ ] SSL certificates installed
- [ ] Security headers active
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Incident response plan
- [ ] Security documentation updated
- [ ] Team training completed

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://react.dev/learn/security)
- [Supabase Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Stripe Security Guide](https://stripe.com/docs/security)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

This security guide provides a comprehensive framework for implementing secure practices in the SweetTrip application rebuild. Each security measure is designed to protect against common vulnerabilities while maintaining a good user experience.

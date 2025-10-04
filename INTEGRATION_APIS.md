# External API Integrations - SweetTrip

## Overview

SweetTrip integrates with multiple external APIs to provide payment processing, email notifications, database services, and content delivery.

## 1. Stripe Payment Processing

### Configuration
```typescript
// src/lib/stripe.ts
import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Make sure VITE_STRIPE_PUBLISHABLE_KEY is set in your environment variables.');
}

export const stripePromise = loadStripe(stripePublishableKey || '');

export const stripeConfig = {
  publishableKey: stripePublishableKey,
  currency: 'usd',
  country: 'US'
};

export const validateStripeConfig = () => {
  if (!stripePublishableKey) {
    console.error('❌ Stripe publishable key is missing');
    return false;
  }
  
  if (!stripePublishableKey.startsWith('pk_')) {
    console.error('❌ Invalid Stripe publishable key format');
    return false;
  }
  
  console.log('✅ Stripe configuration is valid');
  return true;
};
```

### Checkout Session Creation
```typescript
// Create checkout session
export const createCheckoutSession = async (cartItems: CartItem[], customerEmail?: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems: cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.product.name,
          product_image_url: item.product.image,
          price: item.product.price,
          quantity: item.quantity
        })),
        customerEmail,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/cart`
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId, url } = await response.json();
    return { sessionId, url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
```

### Payment Processing
```typescript
// Process payment
export const processPayment = async (sessionId: string) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
};
```

### Webhook Handling
```typescript
// Stripe webhook handler (Supabase Edge Function)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    );

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

## 2. Email Services

### EmailJS Integration
```typescript
// src/lib/emailService.ts
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const initializeEmailJS = () => {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
};

export const sendOrderConfirmation = async (orderData: OrderData) => {
  try {
    const templateParams = {
      to_email: orderData.customerEmail,
      to_name: orderData.customerName,
      order_number: orderData.orderNumber,
      order_total: orderData.total,
      order_items: orderData.items.map(item => 
        `${item.name} x${item.quantity} - $${item.total}`
      ).join('\n'),
      shipping_address: formatAddress(orderData.shippingAddress),
      tracking_number: orderData.trackingNumber || 'Will be provided when shipped'
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Order confirmation email sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (userData: UserData) => {
  try {
    const templateParams = {
      to_email: userData.email,
      to_name: userData.name,
      welcome_message: 'Welcome to SweetTrip! We\'re excited to have you on board.'
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      'welcome_template',
      templateParams
    );

    console.log('Welcome email sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};
```

### Zapier Webhook Integration
```typescript
// Send data to Zapier webhook
export const sendToZapier = async (data: any, webhookUrl: string) => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Zapier webhook failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending to Zapier:', error);
    throw error;
  }
};

// Usage for order notifications
export const notifyOrderCreated = async (order: Order) => {
  const zapierWebhookUrl = import.meta.env.VITE_ZAPIER_ORDER_WEBHOOK;
  
  if (zapierWebhookUrl) {
    await sendToZapier({
      order_id: order.id,
      order_number: order.order_number,
      customer_email: order.customer_email,
      total_amount: order.total_amount,
      status: order.status,
      created_at: order.created_at
    }, zapierWebhookUrl);
  }
};
```

## 3. Supabase Backend

### Client Configuration
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database operations
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createOrder = async (orderData: OrderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Real-time Subscriptions
```typescript
// Subscribe to order updates
export const subscribeToOrderUpdates = (orderId: string, callback: (order: Order) => void) => {
  return supabase
    .channel(`order-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      },
      (payload) => {
        callback(payload.new as Order);
      }
    )
    .subscribe();
};

// Subscribe to new orders (admin)
export const subscribeToNewOrders = (callback: (order: Order) => void) => {
  return supabase
    .channel('new-orders')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        callback(payload.new as Order);
      }
    )
    .subscribe();
};
```

### Edge Functions
```typescript
// Supabase Edge Function for order processing
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { orderId, status } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update order status
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    // Send notification email
    if (status === 'shipped') {
      await sendShippingNotification(data);
    }

    return new Response(JSON.stringify({ success: true, order: data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

## 4. Cloudflare Integration

### CDN Configuration
```typescript
// Image optimization with Cloudflare
export const getOptimizedImageUrl = (imageUrl: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}) => {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // If image is from Cloudflare CDN, add optimization parameters
  if (imageUrl.includes('cloudflare.com')) {
    const url = new URL(imageUrl);
    url.searchParams.set('format', format);
    url.searchParams.set('quality', quality.toString());
    
    if (width) url.searchParams.set('width', width.toString());
    if (height) url.searchParams.set('height', height.toString());
    
    return url.toString();
  }
  
  return imageUrl;
};
```

### Security Headers
```typescript
// Cloudflare security headers configuration
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com https://*.supabase.co;",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
```

## 5. Address Autocomplete

### Google Places API
```typescript
// Address autocomplete using Google Places API
export const initializeAddressAutocomplete = (inputElement: HTMLInputElement) => {
  const autocomplete = new google.maps.places.Autocomplete(inputElement, {
    types: ['address'],
    componentRestrictions: { country: ['us', 'ca', 'mx'] }
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    
    if (place.formatted_address) {
      // Parse address components
      const addressComponents = parseAddressComponents(place.address_components);
      
      // Update form fields
      updateAddressFields(addressComponents);
    }
  });

  return autocomplete;
};

const parseAddressComponents = (components: google.maps.GeocoderAddressComponent[]) => {
  const address: any = {};
  
  components.forEach(component => {
    const type = component.types[0];
    
    switch (type) {
      case 'street_number':
        address.streetNumber = component.long_name;
        break;
      case 'route':
        address.streetName = component.long_name;
        break;
      case 'locality':
        address.city = component.long_name;
        break;
      case 'administrative_area_level_1':
        address.state = component.short_name;
        break;
      case 'postal_code':
        address.zipCode = component.long_name;
        break;
      case 'country':
        address.country = component.short_name;
        break;
    }
  });
  
  return address;
};
```

## 6. Analytics and Monitoring

### Google Analytics
```typescript
// Google Analytics 4 integration
export const initializeGA = (measurementId: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href
    });
  }
};

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Track e-commerce events
export const trackPurchase = (order: Order) => {
  trackEvent('purchase', {
    transaction_id: order.id,
    value: order.total_amount,
    currency: 'USD',
    items: order.items.map(item => ({
      item_id: item.product_id,
      item_name: item.product_name,
      category: item.category,
      quantity: item.quantity,
      price: item.unit_price
    }))
  });
};
```

### Error Monitoring
```typescript
// Error tracking and monitoring
export const logError = (error: Error, context?: Record<string, any>) => {
  console.error('Application Error:', error);
  
  // Send to error monitoring service
  if (import.meta.env.VITE_ERROR_MONITORING_URL) {
    fetch(import.meta.env.VITE_ERROR_MONITORING_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    }).catch(console.error);
  }
};
```

## 7. Performance Monitoring

### Web Vitals
```typescript
// Monitor Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const initializeWebVitals = () => {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
};

// Custom performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  
  // Send to analytics
  trackEvent('performance_measurement', {
    name,
    duration: end - start
  });
};
```

## Environment Variables

### Required Environment Variables
```bash
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Email Services
VITE_EMAILJS_SERVICE_ID=service_...
VITE_EMAILJS_TEMPLATE_ID=template_...
VITE_EMAILJS_PUBLIC_KEY=...

# Zapier
VITE_ZAPIER_ORDER_WEBHOOK=https://hooks.zapier.com/...

# Google APIs
VITE_GOOGLE_PLACES_API_KEY=AIza...
VITE_GOOGLE_ANALYTICS_ID=G-...

# Monitoring
VITE_ERROR_MONITORING_URL=https://...
```

## Error Handling

### API Error Handler
```typescript
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Access denied. You don\'t have permission.';
      case 404:
        return 'Resource not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data?.message || 'An unexpected error occurred.';
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.';
  }
};
```

## Testing

### API Integration Tests
```typescript
// Test Stripe integration
describe('Stripe Integration', () => {
  it('should create checkout session', async () => {
    const mockCartItems = [
      { product_id: '1', product_name: 'Test Product', price: 10.99, quantity: 1 }
    ];

    const result = await createCheckoutSession(mockCartItems, 'test@example.com');
    
    expect(result).toHaveProperty('sessionId');
    expect(result).toHaveProperty('url');
  });
});

// Test Supabase integration
describe('Supabase Integration', () => {
  it('should fetch products', async () => {
    const products = await getProducts();
    
    expect(Array.isArray(products)).toBe(true);
    expect(products.every(p => p.status === 'active')).toBe(true);
  });
});
```

## Migration Notes

1. **API Keys**: Secure all API keys in environment variables
2. **Error Handling**: Implement comprehensive error handling
3. **Rate Limiting**: Respect API rate limits
4. **Monitoring**: Set up monitoring for all integrations
5. **Testing**: Test all API integrations thoroughly
6. **Documentation**: Document all API endpoints and responses
7. **Security**: Implement proper authentication and authorization
8. **Performance**: Monitor and optimize API response times

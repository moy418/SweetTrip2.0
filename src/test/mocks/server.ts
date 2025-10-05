import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Japanese Kit Kat Variety Pack',
    description: 'A delicious assortment of Japanese Kit Kat flavors',
    price: 12.99,
    image: '/images/kitkat-variety.jpg',
    category_id: '1',
    featured: true,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Korean Honey Butter Chips',
    description: 'Crispy chips with sweet honey butter flavor',
    price: 8.99,
    image: '/images/honey-butter-chips.jpg',
    category_id: '2',
    featured: false,
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
  },
]

const mockCategories = [
  {
    id: '1',
    name: 'Chocolate',
    slug: 'chocolate',
    is_active: true,
    sort_order: 1,
  },
  {
    id: '2',
    name: 'Chips',
    slug: 'chips',
    is_active: true,
    sort_order: 2,
  },
]

// Mock handlers
export const handlers = [
  // Products API
  http.get('/api/products', () => {
    return HttpResponse.json({
      data: mockProducts,
      count: mockProducts.length,
    })
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = mockProducts.find(p => p.id === params.id)
    if (!product) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(product)
  }),

  // Categories API
  http.get('/api/categories', () => {
    return HttpResponse.json(mockCategories)
  }),

  // Auth API
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as any
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'test@example.com',
          user_metadata: {
            full_name: 'Test User',
          },
        },
        session: {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
        },
      })
    }
    return new HttpResponse(null, { status: 401 })
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({
      user: {
        id: '2',
        email: body.email,
        user_metadata: {
          full_name: body.full_name,
        },
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      },
    })
  }),

  // Cart API
  http.get('/api/cart', () => {
    return HttpResponse.json({
      items: [],
      total: 0,
    })
  }),

  // Checkout API
  http.post('/api/create-checkout-session', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({
      sessionId: 'mock-session-id',
      url: 'https://checkout.stripe.com/mock-checkout-url',
    })
  }),

  // Orders API
  http.get('/api/orders', () => {
    return HttpResponse.json([])
  }),

  // Fallback for unmatched requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`)
    return new HttpResponse(null, { status: 404 })
  }),
]

// Setup server
export const server = setupServer(...handlers)

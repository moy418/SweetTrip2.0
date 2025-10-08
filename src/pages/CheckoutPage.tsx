import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useLanguage } from '../contexts/LanguageContext'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { ShoppingCart, CreditCard, Truck, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const CheckoutPage: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [guestEmail, setGuestEmail] = React.useState('')
  const [guestName, setGuestName] = React.useState('')
  const [guestPhone, setGuestPhone] = React.useState('')

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 60 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      navigate('/cart')
      return
    }
    
    // Guest checkout is now allowed!

    // Validate guest information if not logged in
    if (!user) {
      if (!guestEmail || !guestName) {
        toast.error('Please enter your email and name to continue')
        return
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(guestEmail)) {
        toast.error('Please enter a valid email address')
        return
      }
    }
    
    setIsProcessing(true)

    try {
      const customerEmail = user?.email || guestEmail
      const customerName = user?.user_metadata?.full_name || guestName
      const customerPhone = user?.phone || guestPhone
      
      console.log('🛒 Creating Stripe checkout session for:', {
        customerEmail,
        customerName,
        customerPhone,
        items: items.length,
        total: total.toFixed(2)
      })
      
      // Prepare cart items for Stripe
      const cartItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_image_url: item.product.image_urls?.[0] || item.product.image,
        price: item.product.price,
        quantity: item.quantity
      }))
      
      // Store order info in localStorage for the success page
      const orderInfo = {
        customerEmail,
        customerName,
        customerPhone,
        items: items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        subtotal,
        shipping,
        tax,
        total,
        timestamp: Date.now()
      }
      
      localStorage.setItem('pending_order', JSON.stringify(orderInfo))

      // Create checkout session with Stripe
      const response = await fetch('http://localhost:3001/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          customerEmail,
          customerName,
          customerPhone,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/cart`
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || 'Failed to create checkout session')
      }

      const { sessionId, url } = await response.json()

      console.log('✅ Stripe session created:', sessionId)
      toast.success('Redirecting to Stripe Checkout...')

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL received from Stripe')
      }

    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to process checkout. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Your cart is empty</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Add some products to your cart to continue with checkout.
                </p>
                <Button onClick={() => navigate('/products')} className="w-full">
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('checkout.title')}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Information Form */}
            {!user && (
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <span>Contact Information</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-2">
                    Enter your details to complete the purchase. 
                    <Link to="/login" className="text-purple-600 hover:text-purple-700 ml-1">
                      Already have an account?
                    </Link>
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="guest-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="guest-email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="guest-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="guest-name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="guest-phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number (optional)
                      </label>
                      <input
                        type="tel"
                        id="guest-phone"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Checkout Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  {shipping === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 text-sm font-medium">
                        🎉 Free shipping applied!
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Proceed to Payment</span>
                        </div>
                      )}
                    </Button>

                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Shield className="h-4 w-4" />
                      <span>Secure payment with Stripe</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage




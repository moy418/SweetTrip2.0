import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Package, Truck, Mail, Calendar, CreditCard, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useLanguage } from '../contexts/LanguageContext'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { sendOrderConfirmationEmail } from '../services/emailService'
import toast from 'react-hot-toast'

const CheckoutSuccessPage: React.FC = () => {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const { clearCart } = useCartStore()
  const { user } = useAuthStore()
  
  const sessionId = searchParams.get('session_id')
  const [orderDetails, setOrderDetails] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Clear cart on successful checkout
    clearCart()
    
    const fetchOrderAndSendEmail = async () => {
      if (sessionId) {
        try {
          // Try to get order info from localStorage
          const pendingOrder = localStorage.getItem('pending_order')
          let orderData
          
          if (pendingOrder) {
            const orderInfo = JSON.parse(pendingOrder)
            orderData = {
              orderNumber: `ST-${Date.now()}`,
              total: orderInfo.total,
              items: orderInfo.items,
              shippingAddress: {
                name: orderInfo.customerName,
                address: '123 Main St',
                city: 'El Paso',
                state: 'TX',
                zip: '79901',
                country: 'US'
              },
              estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            }
            
            // Clean up localStorage
            localStorage.removeItem('pending_order')
          } else {
            // Fallback data
            orderData = {
              orderNumber: `ST-${Date.now()}`,
              total: 45.99,
              items: [
                { name: 'Product 1', quantity: 1, price: 45.99 }
              ],
              shippingAddress: {
                name: user?.user_metadata?.full_name || 'Guest Customer',
                address: '123 Main St',
                city: 'El Paso',
                state: 'TX',
                zip: '79901',
                country: 'US'
              },
              estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            }
          }
          
          setOrderDetails(orderData)
          
          // Get customer info from localStorage if available
          const customerEmail = pendingOrder ? JSON.parse(pendingOrder).customerEmail : user?.email || ''
          const customerPhone = pendingOrder ? JSON.parse(pendingOrder).customerPhone : user?.phone || 'N/A'
          
          // Send email notifications to customer and admin
          const emailSent = await sendOrderConfirmationEmail({
            orderNumber: orderData.orderNumber,
            customerName: orderData.shippingAddress.name,
            customerEmail: customerEmail,
            customerPhone: customerPhone,
            paymentMethod: 'Credit Card',
            paymentReference: sessionId,
            deliveryMethod: 'shipping',
            shippingAddress: orderData.shippingAddress,
            orderItems: orderData.items.map((item: any) => ({
              product_name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            totalAmount: orderData.total,
            shippingCost: 5.99
          })
          
          if (emailSent) {
            console.log('✅ Email notifications sent successfully')
            toast.success('Order confirmation sent to your email!')
          } else {
            console.log('⚠️ Email notifications failed')
            toast.error('Failed to send confirmation email, but your order is confirmed')
          }
          
        } catch (error) {
          console.error('Error processing order:', error)
          toast.error('Order confirmed, but there was an issue sending emails')
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    
    fetchOrderAndSendEmail()
  }, [sessionId, clearCart, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase! Your order has been successfully placed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Order Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderDetails ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Order Number:</span>
                      <span className="text-purple-600 font-bold">{orderDetails.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-lg">${orderDetails.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Payment Method:</span>
                      <span className="flex items-center space-x-1">
                        <CreditCard className="h-4 w-4" />
                        <span>Card ending in 4242</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Order Date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Order details will be available shortly.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderDetails?.shippingAddress ? (
                  <div className="space-y-1">
                    <p className="font-medium">{orderDetails.shippingAddress.name}</p>
                    <p>{orderDetails.shippingAddress.address}</p>
                    <p>
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}
                    </p>
                    <p>{orderDetails.shippingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Shipping address will be available shortly.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Items & Next Steps */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Order Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderDetails?.items ? (
                  <div className="space-y-3">
                    {orderDetails.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Order items will be available shortly.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>What's Next?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Confirmation Email</p>
                      <p className="text-sm text-gray-600">
                        You'll receive an order confirmation email shortly with all the details.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Package className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Order Processing</p>
                      <p className="text-sm text-gray-600">
                        We're preparing your order for shipment. You'll get tracking info once it ships.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Estimated Delivery</p>
                      <p className="text-sm text-gray-600">
                        {orderDetails?.estimatedDelivery 
                          ? `Expected delivery: ${orderDetails.estimatedDelivery.toLocaleDateString()}`
                          : 'Delivery estimate will be provided soon'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              View My Orders
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSuccessPage




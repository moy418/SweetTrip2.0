require('dotenv').config()
const express = require('express')
const cors = require('cors')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Stripe backend is running' })
})

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { cartItems, customerEmail, customerName, customerPhone, successUrl, cancelUrl } = req.body

    console.log('Creating checkout session for:', customerEmail)
    console.log('Cart items:', cartItems)

    // Create line items for Stripe
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product_name,
          images: item.product_image_url ? [item.product_image_url] : [],
          metadata: {
            product_id: item.product_id
          }
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        customer_name: customerName,
        customer_phone: customerPhone || 'N/A',
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'MX', 'ES', 'FR', 'DE', 'IT', 'GB'],
      },
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: 'required',
    })

    console.log('✅ Stripe session created:', session.id)

    res.json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error) {
    console.error('❌ Stripe error:', error)
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to create checkout session'
    })
  }
})

// Stripe Webhook Handler
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      console.log('✅ Payment successful:', session.id)
      
      // TODO: Save order to Supabase database
      // TODO: Send confirmation emails
      // TODO: Update inventory
      
      break
    
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log('✅ PaymentIntent succeeded:', paymentIntent.id)
      break
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      console.log('❌ Payment failed:', failedPayment.id)
      break
    
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  res.json({ received: true })
})

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Stripe backend server running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
  console.log(`💳 Checkout endpoint: http://localhost:${PORT}/api/create-checkout-session`)
  console.log(`🪝 Webhook endpoint: http://localhost:${PORT}/api/webhook`)
})


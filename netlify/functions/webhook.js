const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let stripeEvent

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return {
      statusCode: 400,
      body: `Webhook signature verification failed. ${err.message}`,
    }
  }

  console.log('Processing webhook event:', stripeEvent.type)

  try {
    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(stripeEvent.data.object)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(stripeEvent.data.object)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object)
        break

      default:
        console.log(`Unhandled event type ${stripeEvent.type}`)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' }),
    }
  }
}

// Handle successful checkout
async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata?.userId
  if (!userId) return

  console.log('Checkout session completed for user:', userId)

  // Update user subscription status
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      subscription_tier: getTierFromPriceId(session.line_items?.data?.[0]?.price?.id),
      trial_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user subscription:', error)
  }
}

// Handle new subscription
async function handleSubscriptionCreated(subscription) {
  const customerId = subscription.customer
  console.log('New subscription created:', subscription.id)
  
  // You can add additional logic here if needed
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer
  console.log('Subscription updated:', subscription.id)
  
  // Handle plan changes, status updates, etc.
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer
  console.log('Subscription cancelled:', subscription.id)
  
  // Downgrade user to free tier
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'cancelled',
      subscription_tier: 'free',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating cancelled subscription:', error)
  }
}

// Handle successful payment
async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer
  console.log('Payment succeeded for customer:', customerId)
  
  // Reset monthly image count, extend subscription, etc.
}

// Handle failed payment
async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer
  console.log('Payment failed for customer:', customerId)
  
  // Handle failed payment logic
}

// Helper function to determine tier from price ID
function getTierFromPriceId(priceId) {
  // You'll need to update this based on your actual Stripe Price IDs
  if (priceId?.includes('starter')) return 'starter'
  if (priceId?.includes('pro')) return 'pro'
  if (priceId?.includes('enterprise')) return 'enterprise'
  return 'free'
}

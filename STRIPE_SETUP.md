# Stripe Integration Setup Guide

## 1. Stripe Dashboard Setup

### Create Products and Prices

**Subscription Products:**

1. **Starter Plan**
   - Product Name: "TomaAI Starter"
   - Price: $9.00/month
   - Billing: Recurring monthly
   - Trial: 3 days
   - Copy the Price ID (starts with `price_`)

2. **Pro Plan**
   - Product Name: "TomaAI Pro"
   - Price: $15.00/month
   - Billing: Recurring monthly
   - Trial: 3 days
   - Copy the Price ID

3. **Enterprise Plan**
   - Product Name: "TomaAI Enterprise"
   - Price: $49.00/month
   - Billing: Recurring monthly
   - Trial: 3 days
   - Copy the Price ID

**Pay-per-Image Products:**

1. **Single Image** - $0.50
2. **5 Images** - $2.00
3. **10 Images** - $3.50
4. **25 Images** - $7.50

**Bulk Packages:**

1. **100 Images** - $5.00
2. **500 Images** - $20.00
3. **1000 Images** - $35.00

### Webhook Setup

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## 2. Environment Variables

Add to your `.env` file:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Add to Netlify environment variables:
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## 3. Update Price IDs

Replace the placeholder price IDs in `src/lib/stripe.ts` with your actual Stripe Price IDs:

```typescript
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    features: ['50 images/month', 'All styles', 'High quality', '3-day free trial'],
    maxImages: 50,
    stripePriceId: 'price_1234567890' // Replace with actual ID
  },
  // ... update all price IDs
]
```

## 4. Backend API Endpoints

You'll need to create these API endpoints (using Netlify Functions, Vercel Functions, or your preferred backend):

### `/api/create-checkout-session`
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = async (event, context) => {
  const { priceId, userId, userEmail, mode } = JSON.parse(event.body)
  
  const session = await stripe.checkout.sessions.create({
    mode,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.URL}/pricing`,
    customer_email: userEmail,
    metadata: {
      userId,
    },
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ sessionId: session.id }),
  }
}
```

### `/api/webhook`
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let stripeEvent

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret)
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook signature verification failed. ${err.message}`,
    }
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      // Update user subscription in database
      break
    case 'customer.subscription.created':
      // Handle new subscription
      break
    case 'customer.subscription.updated':
      // Handle subscription changes
      break
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      break
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`)
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  }
}
```

## 5. Database Updates

Update your Supabase `users` table to track subscriptions:

```sql
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN subscription_id TEXT;
ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN subscription_tier TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN trial_ends_at TIMESTAMP;
```

## 6. Integration Steps

1. **Install Stripe dependencies:**
   ```bash
   npm install @stripe/stripe-js stripe
   ```

2. **Update your components** to use the new PaymentService component

3. **Test with Stripe test cards:**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`

## 7. Testing Checklist

- [ ] Subscription plans redirect to Stripe Checkout
- [ ] Pay-per-image options work
- [ ] Bulk packages work
- [ ] Webhooks update user subscription status
- [ ] Trial periods work correctly
- [ ] Subscription cancellation works
- [ ] Payment success/failure handling

## 8. Go Live

1. Switch to live mode in Stripe Dashboard
2. Update environment variables with live keys
3. Update webhook endpoint to production URL
4. Test with real payment methods
5. Monitor webhook events in Stripe Dashboard

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Checkout: https://stripe.com/docs/checkout
- Webhooks: https://stripe.com/docs/webhooks

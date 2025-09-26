import { loadStripe } from '@stripe/stripe-js'

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  features: string[]
  maxImages: number
  stripePriceId: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    features: ['50 images/month', 'All styles', 'High quality', '3-day free trial'],
    maxImages: 50,
    stripePriceId: 'price_starter_monthly' // You'll replace this with actual Stripe price IDs
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 15,
    features: ['200 images/month', 'All styles', 'Ultra HD', 'Priority support', '3-day free trial'],
    maxImages: 200,
    stripePriceId: 'price_pro_monthly'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49,
    features: ['Unlimited images', 'All styles', 'Ultra HD', 'API access', '3-day free trial'],
    maxImages: -1, // Unlimited
    stripePriceId: 'price_enterprise_monthly'
  }
]

export interface PayPerImageOption {
  id: string
  images: number
  price: number
  savings: number
  popular?: boolean
  stripePriceId: string
}

export const PAY_PER_IMAGE_OPTIONS: PayPerImageOption[] = [
  {
    id: 'single',
    images: 1,
    price: 0.50,
    savings: 0,
    stripePriceId: 'price_single_image'
  },
  {
    id: 'five',
    images: 5,
    price: 2.00,
    savings: 20,
    stripePriceId: 'price_five_images'
  },
  {
    id: 'ten',
    images: 10,
    price: 3.50,
    savings: 30,
    popular: true,
    stripePriceId: 'price_ten_images'
  },
  {
    id: 'twenty_five',
    images: 25,
    price: 7.50,
    savings: 40,
    stripePriceId: 'price_twenty_five_images'
  }
]

export interface BulkPackage {
  id: string
  images: number
  price: number
  savings: number
  popular?: boolean
  stripePriceId: string
}

export const BULK_PACKAGES: BulkPackage[] = [
  {
    id: 'hundred',
    images: 100,
    price: 5.00,
    savings: 50,
    popular: true,
    stripePriceId: 'price_hundred_images'
  },
  {
    id: 'five_hundred',
    images: 500,
    price: 20.00,
    savings: 60,
    stripePriceId: 'price_five_hundred_images'
  },
  {
    id: 'thousand',
    images: 1000,
    price: 35.00,
    savings: 65,
    stripePriceId: 'price_thousand_images'
  }
]

import { createCheckoutSession as apiCreateCheckoutSession, createPaymentSession as apiCreatePaymentSession } from './api'

// Function to create Stripe Checkout session for subscriptions
export async function createCheckoutSession(priceId: string, userId: string, userEmail: string) {
  return apiCreateCheckoutSession({
    priceId,
    userId,
    userEmail,
    mode: 'subscription'
  })
}

// Function to create Stripe Checkout session for one-time payments
export async function createPaymentSession(priceId: string, userId: string, userEmail: string) {
  return apiCreatePaymentSession({
    priceId,
    userId,
    userEmail,
    mode: 'payment'
  })
}

// Function to redirect to Stripe Checkout
export async function redirectToCheckout(sessionId: string) {
  const stripe = await stripePromise
  if (!stripe) {
    throw new Error('Stripe failed to load')
  }

  const { error } = await stripe.redirectToCheckout({
    sessionId,
  })

  if (error) {
    throw new Error(error.message)
  }
}

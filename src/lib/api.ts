// API utility functions for Stripe integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export interface CheckoutSessionRequest {
  priceId: string
  userId: string
  userEmail: string
  mode: 'subscription' | 'payment'
}

export interface CheckoutSessionResponse {
  sessionId: string
}

// Create Stripe Checkout session
export async function createCheckoutSession(request: CheckoutSessionRequest): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create checkout session')
    }

    const data: CheckoutSessionResponse = await response.json()
    return data.sessionId
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Create Stripe Payment session (for one-time payments)
export async function createPaymentSession(request: CheckoutSessionRequest): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/create-payment-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create payment session')
    }

    const data: CheckoutSessionResponse = await response.json()
    return data.sessionId
  } catch (error) {
    console.error('Error creating payment session:', error)
    throw error
  }
}

// Get user's subscription status
export async function getSubscriptionStatus(userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/subscription-status?userId=${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to get subscription status')
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting subscription status:', error)
    throw error
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    })

    if (!response.ok) {
      throw new Error('Failed to cancel subscription')
    }

    return await response.json()
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

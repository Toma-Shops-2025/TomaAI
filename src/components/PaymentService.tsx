import React, { useState } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import { Button } from '@/components/ui/button'
import { 
  SUBSCRIPTION_PLANS, 
  PAY_PER_IMAGE_OPTIONS, 
  BULK_PACKAGES,
  createCheckoutSession,
  createPaymentSession,
  redirectToCheckout
} from '@/lib/stripe'

interface PaymentServiceProps {
  type: 'subscription' | 'pay-per-image' | 'bulk'
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function PaymentService({ type, onSuccess, onError }: PaymentServiceProps) {
  const { user } = useSupabase()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscription = async (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    if (!user) {
      onError?.('Please sign in to subscribe')
      return
    }

    setLoading(plan.id)
    try {
      const sessionId = await createCheckoutSession(
        plan.stripePriceId,
        user.id,
        user.email || ''
      )
      await redirectToCheckout(sessionId)
      onSuccess?.()
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setLoading(null)
    }
  }

  const handlePayPerImage = async (option: typeof PAY_PER_IMAGE_OPTIONS[0]) => {
    if (!user) {
      onError?.('Please sign in to purchase images')
      return
    }

    setLoading(option.id)
    try {
      const sessionId = await createPaymentSession(
        option.stripePriceId,
        user.id,
        user.email || ''
      )
      await redirectToCheckout(sessionId)
      onSuccess?.()
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setLoading(null)
    }
  }

  const handleBulkPackage = async (pkg: typeof BULK_PACKAGES[0]) => {
    if (!user) {
      onError?.('Please sign in to purchase bulk packages')
      return
    }

    setLoading(pkg.id)
    try {
      const sessionId = await createPaymentSession(
        pkg.stripePriceId,
        user.id,
        user.email || ''
      )
      await redirectToCheckout(sessionId)
      onSuccess?.()
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setLoading(null)
    }
  }

  if (type === 'subscription') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-slate-800 rounded-2xl p-8 shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
              plan.id === 'pro' 
                ? 'border-cyan-500 scale-105' 
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            {plan.id === 'pro' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400">/month</span>
              </div>
              <span className="bg-cyan-600 text-white text-sm px-3 py-1 rounded-full">
                3-day free trial
              </span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-3 mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleSubscription(plan)}
              disabled={loading === plan.id}
              className={`w-full py-3 text-lg font-semibold ${
                plan.id === 'pro'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              {loading === plan.id ? 'Processing...' : 'Start Free Trial'}
            </Button>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'pay-per-image') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {PAY_PER_IMAGE_OPTIONS.map((option) => (
          <div
            key={option.id}
            className={`relative bg-slate-800 rounded-xl p-6 text-center border-2 transition-all duration-200 hover:shadow-lg ${
              option.popular ? 'border-cyan-500 scale-105' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            {option.popular && (
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Popular
              </span>
            )}
            <p className="text-4xl font-bold text-white mb-2">{option.images}</p>
            <p className="text-gray-300 text-lg mb-4">Images</p>
            <p className="text-3xl font-bold text-white mb-4">${option.price.toFixed(2)}</p>
            {option.savings > 0 && (
              <p className="text-green-400 text-sm mb-4">{option.savings}% Savings!</p>
            )}
            <Button
              onClick={() => handlePayPerImage(option)}
              disabled={loading === option.id}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-md font-medium transition-colors"
            >
              {loading === option.id ? 'Processing...' : 'Buy Now'}
            </Button>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'bulk') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BULK_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-slate-800 rounded-xl p-6 text-center border-2 transition-all duration-200 hover:shadow-lg ${
              pkg.popular ? 'border-purple-500 scale-105' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Best Value
              </span>
            )}
            <p className="text-4xl font-bold text-white mb-2">{pkg.images}</p>
            <p className="text-gray-300 text-lg mb-4">Images</p>
            <p className="text-3xl font-bold text-white mb-4">${pkg.price.toFixed(2)}</p>
            {pkg.savings > 0 && (
              <p className="text-green-400 text-sm mb-4">{pkg.savings}% Savings!</p>
            )}
            <Button
              onClick={() => handleBulkPackage(pkg)}
              disabled={loading === pkg.id}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-medium transition-colors"
            >
              {loading === pkg.id ? 'Processing...' : 'Buy Now'}
            </Button>
          </div>
        ))}
      </div>
    )
  }

  return null
}

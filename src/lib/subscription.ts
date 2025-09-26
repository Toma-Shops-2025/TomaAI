// Subscription management and validation
export interface SubscriptionTier {
  name: string
  maxImages: number
  price: number
  features: string[]
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    name: 'Free',
    maxImages: 26, // Temporarily increased for 6 more generations
    price: 0,
    features: ['26 free images', 'All styles', 'Standard quality']
  },
  starter: {
    name: 'Starter',
    maxImages: 50,
    price: 9,
    features: ['50 images/month', 'All styles', 'High quality', '3-day free trial']
  },
  pro: {
    name: 'Pro',
    maxImages: 200,
    price: 15,
    features: ['200 images/month', 'All styles', 'Ultra HD', 'Priority support', '3-day free trial']
  },
  enterprise: {
    name: 'Enterprise',
    maxImages: -1, // Unlimited
    price: 49,
    features: ['Unlimited images', 'All styles', 'Ultra HD', 'API access', '3-day free trial']
  }
}

export function getSubscriptionTier(userTier: string): SubscriptionTier {
  return SUBSCRIPTION_TIERS[userTier] || SUBSCRIPTION_TIERS.free
}

export function canGenerateImage(userTier: string, imagesUsed: number): boolean {
  const tier = getSubscriptionTier(userTier)
  
  // Unlimited for enterprise
  if (tier.maxImages === -1) return true
  
  // Check if user has remaining images
  return imagesUsed < tier.maxImages
}

export function getRemainingImages(userTier: string, imagesUsed: number): number {
  const tier = getSubscriptionTier(userTier)
  
  if (tier.maxImages === -1) return -1 // Unlimited
  
  return Math.max(0, tier.maxImages - imagesUsed)
}

export function isTrialActive(trialEndsAt: string | null): boolean {
  if (!trialEndsAt) return false
  
  const trialEnd = new Date(trialEndsAt)
  const now = new Date()
  
  return now < trialEnd
}

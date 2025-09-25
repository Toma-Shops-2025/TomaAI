import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Check, Star } from 'lucide-react'

interface PricingTier {
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
  buttonText: string
  buttonVariant: "default" | "outline" | "secondary"
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: 9.00,
    description: "Perfect for getting started with AI image generation",
    features: [
      "50 AI-generated images per month",
      "Basic style presets",
      "Standard quality (1024x1024)",
      "Email support",
      "3-day free trial"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "outline"
  },
  {
    name: "Pro",
    price: 15.00,
    description: "For creators who need more power and flexibility",
    features: [
      "200 AI-generated images per month",
      "All style presets + custom styles",
      "High quality (2048x2048)",
      "Priority support",
      "Advanced generation settings",
      "3-day free trial"
    ],
    popular: true,
    buttonText: "Start Free Trial",
    buttonVariant: "default"
  },
  {
    name: "Enterprise",
    price: 49.00,
    description: "For teams and businesses with high-volume needs",
    features: [
      "Unlimited AI-generated images",
      "All style presets + custom styles",
      "Ultra HD quality (4096x4096)",
      "24/7 dedicated support",
      "API access",
      "Team collaboration features",
      "3-day free trial"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "outline"
  }
]

export default function PricingModal() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const handleSubscribe = (tierName: string) => {
    // In a real app, this would integrate with a payment processor like Stripe
    alert(`Starting 3-day free trial for ${tierName} plan!`)
    setSelectedTier(tierName)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
          View Pricing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            Choose Your Plan
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Start with a 3-day free trial for any plan. No credit card required.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                tier.popular 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  3-day free trial
                </Badge>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(tier.name)}
                variant={tier.buttonVariant}
                className={`w-full py-3 text-lg font-semibold ${
                  tier.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    : ''
                }`}
              >
                {tier.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            All plans include a 3-day free trial. Cancel anytime during the trial period.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import React, { useState } from 'react';

interface ExtendedPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userId?: string;
}

export default function ExtendedPricingModal({ isOpen, onClose, userEmail, userId }: ExtendedPricingModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  if (!isOpen) return null;

  const payPerImageOptions = [
    { images: 1, price: 0.50, popular: false },
    { images: 5, price: 2.00, popular: false },
    { images: 10, price: 3.50, popular: true },
    { images: 25, price: 7.50, popular: false }
  ];

  const bulkPackages = [
    { images: 100, price: 5.00, savings: '50%', popular: true },
    { images: 500, price: 20.00, savings: '60%', popular: false },
    { images: 1000, price: 35.00, savings: '65%', popular: false }
  ];

  const subscriptionPlans = [
    {
      name: "Starter",
      price: 9.00,
      description: "Perfect for getting started",
      features: [
        "50 AI-generated images per month",
        "Basic style presets",
        "Standard quality (1024x1024)",
        "Email support",
        "3-day free trial"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: 15.00,
      description: "For creators who need more power",
      features: [
        "200 AI-generated images per month",
        "All style presets + custom styles",
        "High quality (2048x2048)",
        "Priority support",
        "Advanced generation settings",
        "3-day free trial"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: 49.00,
      description: "For teams and businesses",
      features: [
        "Unlimited AI-generated images",
        "All style presets + custom styles",
        "Ultra HD quality (4096x4096)",
        "24/7 dedicated support",
        "API access",
        "Team collaboration features",
        "3-day free trial"
      ],
      popular: false
    }
  ];

  const handlePurchase = async (packageType: string, images: number, price: number) => {
    try {
      const confirmed = window.confirm(
        `Purchase ${images} images for $${price.toFixed(2)}?\n\nThis will redirect you to our secure payment processor.`
      );
      
      if (confirmed) {
        // For now, show a message that payment is being set up
        alert(`Payment integration is being set up. For now, please contact support to purchase ${images} images for $${price.toFixed(2)}. We'll have automatic payments available soon!`);
        onClose();
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Payment processing is temporarily unavailable. Please contact support for manual processing.');
    }
  };

  const handleSubscribe = async (planName: string, price: number) => {
    try {
      const confirmed = window.confirm(
        `Start 3-day free trial for ${planName} plan ($${price}/month after trial)?\n\nThis will redirect you to our secure payment processor.`
      );
      
      if (confirmed) {
        // For now, show a message that subscription is being set up
        alert(`Subscription integration is being set up. For now, please contact support to start your ${planName} plan ($${price}/month). We'll have automatic subscriptions available soon!`);
        onClose();
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription processing is temporarily unavailable. Please contact support for manual setup.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Extended Pricing Options</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Subscription Plans Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Subscription Plans</h3>
              <p className="text-gray-400 mb-6">Best value for regular users - Start with a 3-day free trial!</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`p-6 rounded-lg border transition-all ${
                      plan.popular
                        ? 'border-cyan-500 bg-cyan-900/20 scale-105'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    {plan.popular && (
                      <div className="text-center mb-4">
                        <span className="bg-cyan-600 text-white text-xs px-3 py-1 rounded-full">Most Popular</span>
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-white">${plan.price}</span>
                        <span className="text-gray-400">/month</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handleSubscribe(plan.name, plan.price)}
                      className={`w-full py-2 px-4 rounded-md font-medium transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
                          : 'bg-slate-600 hover:bg-slate-500 text-white'
                      }`}
                    >
                      Start Free Trial
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Pay-per-Image Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Pay-per-Image</h3>
              <p className="text-gray-400 mb-6">Perfect for occasional use</p>
              
              <div className="space-y-3">
                {payPerImageOptions.map((option) => (
                  <div
                    key={option.images}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPackage === `pay-${option.images}`
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedPackage(`pay-${option.images}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{option.images} image{option.images > 1 ? 's' : ''}</span>
                          {option.popular && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Popular</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">${option.price.toFixed(2)} total</p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">${(option.price / option.images).toFixed(2)}</div>
                        <div className="text-gray-400 text-sm">per image</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk Packages Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Bulk Packages</h3>
              <p className="text-gray-400 mb-6">Best value for heavy users</p>
              
              <div className="space-y-3">
                {bulkPackages.map((pkg) => (
                  <div
                    key={pkg.images}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPackage === `bulk-${pkg.images}`
                        ? 'border-green-500 bg-green-900/20'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedPackage(`bulk-${pkg.images}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{pkg.images} images</span>
                          {pkg.popular && (
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Best Value</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">Save {pkg.savings} vs pay-per-image</p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">${pkg.price.toFixed(2)}</div>
                        <div className="text-gray-400 text-sm">${(pkg.price / pkg.images).toFixed(3)} per image</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Support Section */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="bg-slate-700 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Need Help Choosing?</h3>
              <p className="text-gray-300 mb-4">
                Our payment system is being upgraded. Contact support for immediate assistance with purchases.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:support@tomaai.online"
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-md transition-all"
                >
                  Contact Support
                </a>
                <a
                  href="https://tomaai.online/help"
                  className="bg-slate-600 hover:bg-slate-500 text-white font-medium py-2 px-6 rounded-md transition-all"
                >
                  View Help Center
                </a>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          {selectedPackage && (
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">
                    {selectedPackage.startsWith('pay-') 
                      ? `${selectedPackage.split('-')[1]} images - Pay-per-Image`
                      : `${selectedPackage.split('-')[1]} images - Bulk Package`
                    }
                  </p>
                </div>
                <button
                  onClick={() => {
                    const [type, count] = selectedPackage.split('-');
                    const images = parseInt(count);
                    const price = type === 'pay' 
                      ? payPerImageOptions.find(p => p.images === images)?.price || 0
                      : bulkPackages.find(p => p.images === images)?.price || 0;
                    handlePurchase(type, images, price);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-md transition-all"
                >
                  Purchase Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

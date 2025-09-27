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

  const handlePurchase = async (packageType: string, images: number, price: number) => {
    try {
      const confirmed = window.confirm(
        `Purchase ${images} images for $${price.toFixed(2)}?\n\nThis will redirect you to our secure payment processor.`
      );
      
      if (confirmed) {
        // Use passed user info or fallback
        const email = userEmail || 'user@example.com';
        const id = userId || 'temp-user-id';
        
        // Create price ID based on package
        let priceId = '';
        if (packageType === 'pay') {
          if (images === 1) priceId = 'price_single_image';
          else if (images === 5) priceId = 'price_five_images';
          else if (images === 10) priceId = 'price_ten_images';
          else if (images === 25) priceId = 'price_twenty_five_images';
        } else if (packageType === 'bulk') {
          if (images === 100) priceId = 'price_hundred_images';
          else if (images === 500) priceId = 'price_five_hundred_images';
          else if (images === 1000) priceId = 'price_thousand_images';
        }
        
        if (!priceId) {
          alert('Invalid package selection. Please try again.');
          return;
        }
        
        // Create payment session
        const { createPaymentSession, redirectToCheckout } = await import('@/lib/stripe');
        const sessionId = await createPaymentSession(priceId, id, email);
        
        // Redirect to Stripe Checkout
        await redirectToCheckout(sessionId);
        onClose();
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Payment processing failed. Please try again.');
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

          {/* Purchase Button */}
          {selectedPackage && (
            <div className="mt-8 pt-6 border-t border-slate-700">
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

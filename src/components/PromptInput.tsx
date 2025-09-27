import React, { useState } from 'react';

interface PromptInputProps {
  onGenerate: (prompt: string, negativePrompt: string) => void;
  isGenerating: boolean;
  userTier?: string;
  imagesUsed?: number;
  maxImages?: number;
  generationProgress?: number;
  generationStatus?: string;
  onEmailCollection?: (email: string) => void;
  onShowPricing?: () => void;
  emailCollected?: boolean;
}

export default function PromptInput({ onGenerate, isGenerating, userTier, imagesUsed, maxImages, generationProgress, generationStatus, onEmailCollection, onShowPricing, emailCollected }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showEmailSignup, setShowEmailSignup] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      // Check if user needs to provide email for free images
      // Show email modal if they've used 1+ images but haven't provided email
      console.log('Debug - Email check:', { userTier, imagesUsed, emailCollected });
      if (userTier === 'free' && (imagesUsed || 0) >= 1 && !emailCollected) {
        console.log('Showing email modal');
        setShowEmailSignup(true);
        return;
      }
      
      // If they've used all 3 free images, show pricing instead
      if (userTier === 'free' && (imagesUsed || 0) >= 3) {
        if (onShowPricing) {
          onShowPricing();
        }
        return;
      }
      
      onGenerate(prompt, negativePrompt);
    }
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Call the email collection handler
      if (onEmailCollection) {
        onEmailCollection(email);
      }
      setShowEmailSignup(false);
      onGenerate(prompt, negativePrompt);
    }
  };

  const examplePrompts = [
    "A majestic dragon soaring through clouds at sunset",
    "Cyberpunk cityscape with neon lights reflecting on wet streets",
    "Portrait of a wise old wizard with a long beard and magical staff"
  ];

  return (
    <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white font-semibold text-lg mb-3">
            Describe your image
          </label>
          {userTier && (
            <div className="mb-3 text-sm text-slate-300">
              {userTier === 'free' ? (
                <span className="bg-slate-700 px-3 py-1 rounded-full text-xs">Free plan: {imagesUsed || 0}/3 images used</span>
              ) : (
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 rounded-full text-xs">{userTier.charAt(0).toUpperCase() + userTier.slice(1)} plan: {imagesUsed || 0}/{maxImages || 'unlimited'} images used</span>
              )}
            </div>
          )}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A beautiful landscape with mountains and a lake..."
            className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-400 border border-slate-600"
            disabled={isGenerating}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPrompt(example)}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-full transition-colors border border-slate-600"
              disabled={isGenerating}
            >
              {example.slice(0, 30)}...
            </button>
          ))}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>
        </div>

        {showAdvanced && (
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              Negative Prompt (what to avoid)
            </label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="blurry, low quality, distorted..."
              className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 h-24 resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-400 border border-slate-600"
              disabled={isGenerating}
            />
          </div>
        )}

        {/* Progress Indicator */}
        {isGenerating && (
          <div className="bg-slate-700 rounded-xl p-4 mb-4 border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{generationStatus || 'Generating your image...'}</span>
              <span className="text-cyan-400 font-bold">{generationProgress || 0}%</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${generationProgress || 0}%` }}
              ></div>
            </div>
            <div className="text-slate-300 text-sm mt-2">
              {generationProgress && generationProgress < 100 ? 'Creating your masterpiece...' : 'Finalizing your image...'}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg"
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </button>

        {/* Email Signup Modal */}
        {showEmailSignup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-4">Get 3 Free Images!</h3>
              <p className="text-slate-300 mb-6">
                Sign up with your email to generate 3 free AI images. No credit card required!
              </p>
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none border border-slate-600"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEmailSignup(false)}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-3 rounded-xl transition-colors"
                  >
                    Get Free Images
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
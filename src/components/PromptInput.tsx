import React, { useState } from 'react';

interface PromptInputProps {
  onGenerate: (prompt: string, negativePrompt: string) => void;
  isGenerating: boolean;
  userTier?: string;
  imagesUsed?: number;
  maxImages?: number;
  generationProgress?: number;
  generationStatus?: string;
  onShowPricing?: () => void;
}

export default function PromptInput({ onGenerate, isGenerating, userTier, imagesUsed, maxImages, generationProgress, generationStatus, onShowPricing }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      // If they've used all their free images, show pricing instead
      if (userTier === 'free' && (imagesUsed || 0) >= (maxImages || 3)) {
        if (onShowPricing) {
          onShowPricing();
        }
        return;
      }
      
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
              {userTier === 'free' && maxImages === 1 ? (
                <span className="bg-slate-700 px-3 py-1 rounded-full text-xs">Free trial: {imagesUsed || 0}/1 image used</span>
              ) : userTier === 'free' ? (
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

      </form>
    </div>
  );
}
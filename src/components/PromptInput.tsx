import React, { useState } from 'react';

interface PromptInputProps {
  onGenerate: (prompt: string, negativePrompt: string) => void;
  isGenerating: boolean;
  userTier?: string;
  imagesUsed?: number;
  maxImages?: number;
  generationProgress?: number;
  generationStatus?: string;
}

export default function PromptInput({ onGenerate, isGenerating, userTier, imagesUsed, maxImages, generationProgress, generationStatus }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt, negativePrompt);
    }
  };

  const examplePrompts = [
    "A majestic dragon soaring through clouds at sunset",
    "Cyberpunk cityscape with neon lights reflecting on wet streets",
    "Portrait of a wise old wizard with a long beard and magical staff"
  ];

  return (
    <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white font-semibold text-lg mb-3">
            Describe your image
          </label>
          {userTier && (
            <div className="mb-3 text-sm text-gray-300">
              {userTier === 'free' ? (
                <span>Free plan: {imagesUsed || 0}/3 images used</span>
              ) : (
                <span>{userTier.charAt(0).toUpperCase() + userTier.slice(1)} plan: {imagesUsed || 0}/{maxImages || 'unlimited'} images used</span>
              )}
            </div>
          )}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A beautiful landscape with mountains and a lake..."
            className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
            disabled={isGenerating}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPrompt(example)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-full transition-colors"
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
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>
        </div>

        {showAdvanced && (
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Negative Prompt (what to avoid)
            </label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="blurry, low quality, distorted..."
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              disabled={isGenerating}
            />
          </div>
        )}

        {/* Progress Indicator */}
        {isGenerating && (
          <div className="bg-gray-700 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{generationStatus || 'Generating your image...'}</span>
              <span className="text-blue-400 font-bold">{generationProgress || 0}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${generationProgress || 0}%` }}
              ></div>
            </div>
            <div className="text-gray-300 text-sm mt-2">
              {generationProgress && generationProgress < 100 ? 'Creating your masterpiece...' : 'Finalizing your image...'}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </button>
      </form>
    </div>
  );
}
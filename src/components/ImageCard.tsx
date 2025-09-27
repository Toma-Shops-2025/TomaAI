import React, { useState } from 'react';

interface ImageCardProps {
  src: string;
  prompt: string;
  style: string;
  onDownload: (imageUrl: string, prompt: string) => void;
  onVariation: (prompt: string, style: string) => void;
  onDelete?: () => void;
  createdAt?: string;
  isRegenerating?: boolean;
}

export default function ImageCard({ src, prompt, style, onDownload, onVariation, onDelete, createdAt, isRegenerating }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Safety checks
  if (!src || !prompt || !style) {
    return (
      <div className="relative group bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 p-4">
        <div className="w-full h-64 bg-slate-700 flex items-center justify-center">
          <span className="text-gray-400">Invalid image data</span>
        </div>
      </div>
    );
  }

  // Handle expired DALL-E URLs
  if (imageError || (src.includes('oaidalleapiprodscus.blob.core.windows.net') && src.includes('st='))) {
    return (
      <div className="relative group bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 p-4">
        <div className="w-full h-64 bg-slate-700 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-2">🖼️</div>
            <div className="text-gray-400 text-sm">Image expired</div>
            <div className="text-gray-500 text-xs mt-1">DALL-E URLs expire after 2 hours</div>
          </div>
        </div>
        <div className="absolute top-2 left-2 bg-slate-700 px-2 py-1 rounded text-xs text-gray-300">
          {style}
        </div>
        <div className="p-3">
          <p className="text-white text-sm font-medium mb-2 line-clamp-2">{prompt}</p>
          <div className="flex gap-2">
            <button
              onClick={() => onVariation(prompt, style)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 px-2 rounded transition-colors"
            >
              Regenerate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative group bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-slate-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt={prompt}
        className="w-full h-64 object-cover"
        onError={() => setImageError(true)}
      />
      
      {/* Delete button - always visible in top right */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Delete image"
        >
          ×
        </button>
      )}

      {/* Timestamp - always visible in top left */}
      {createdAt && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {new Date(createdAt).toLocaleString()}
        </div>
      )}

      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-between p-4 transition-opacity duration-200">
          <div>
            <span className="inline-block px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs rounded-full mb-2">
              {style}
            </span>
            <p className="text-white text-sm line-clamp-3">{prompt}</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onDownload(src, prompt)}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            >
              Download
            </button>
            <button
              onClick={() => onVariation(prompt, style)}
              disabled={isRegenerating}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                isRegenerating 
                  ? 'bg-purple-600 text-white cursor-not-allowed' 
                  : 'bg-slate-600 hover:bg-slate-700 text-white'
              }`}
            >
              {isRegenerating ? 'Regenerating...' : 'Variation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
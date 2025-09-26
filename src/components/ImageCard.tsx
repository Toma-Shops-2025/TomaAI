import React, { useState } from 'react';

interface ImageCardProps {
  src: string;
  prompt: string;
  style: string;
  onDownload: (imageUrl: string, prompt: string) => void;
  onVariation: (prompt: string, style: string) => void;
}

export default function ImageCard({ src, prompt, style, onDownload, onVariation }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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
        onError={(e) => {
          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
        }}
      />
      
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
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            >
              Variation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
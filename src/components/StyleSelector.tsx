import React, { useState } from 'react';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  disabled?: boolean;
}

const styles = [
  { 
    id: 'photorealistic', 
    name: 'Photorealistic', 
    description: 'Lifelike photos', 
    icon: '📸',
    sampleImage: '/images/styles/photorealistic-sample.png'
  },
  { 
    id: 'abstract', 
    name: 'Abstract', 
    description: 'Modern art', 
    icon: '🎨',
    sampleImage: '/images/styles/abstract-sample.png'
  },
  { 
    id: 'anime', 
    name: 'Anime', 
    description: 'Japanese animation', 
    icon: '🎌',
    sampleImage: '/images/styles/anime-sample.png'
  },
  { 
    id: 'artistic', 
    name: 'Artistic', 
    description: 'Traditional art', 
    icon: '🖼️',
    sampleImage: '/images/styles/artistic-sample.png'
  },
  { 
    id: 'cyberpunk', 
    name: 'Cyberpunk', 
    description: 'Futuristic neon', 
    icon: '🌃',
    sampleImage: '/images/styles/cyberpunk-sample.png'
  },
  { 
    id: 'fantasy', 
    name: 'Fantasy', 
    description: 'Magical worlds', 
    icon: '🧙‍♂️',
    sampleImage: '/images/styles/fantasy-sample.png'
  },
  { 
    id: 'vintage', 
    name: 'Vintage', 
    description: 'Retro classic', 
    icon: '📻',
    sampleImage: '/images/styles/vintage-sample.png'
  },
  { 
    id: 'minimalist', 
    name: 'Minimalist', 
    description: 'Clean & simple', 
    icon: '⚪',
    sampleImage: '/images/styles/minimalist-sample.png'
  },
  { 
    id: 'watercolor', 
    name: 'Watercolor', 
    description: 'Soft painting', 
    icon: '🎨',
    sampleImage: '/images/styles/watercolor-sample.png'
  },
  { 
    id: 'oil_painting', 
    name: 'Oil Painting', 
    description: 'Classical art', 
    icon: '🖌️',
    sampleImage: '/images/styles/oil-painting-sample.png'
  },
  { 
    id: 'digital_art', 
    name: 'Digital Art', 
    description: 'Modern digital', 
    icon: '💻',
    sampleImage: '/images/styles/digital-art-sample.png'
  },
  { 
    id: 'sketch', 
    name: 'Sketch', 
    description: 'Hand-drawn', 
    icon: '✏️',
    sampleImage: '/images/styles/sketch-sample.png'
  },
  { 
    id: 'pop_art', 
    name: 'Pop Art', 
    description: 'Bold & vibrant', 
    icon: '🟡',
    sampleImage: '/images/styles/pop-art-sample.png'
  },
  { 
    id: 'surreal', 
    name: 'Surreal', 
    description: 'Dreamlike', 
    icon: '🌙',
    sampleImage: '/images/styles/surreal-sample.png'
  },
  { 
    id: 'steampunk', 
    name: 'Steampunk', 
    description: 'Victorian tech', 
    icon: '⚙️',
    sampleImage: '/images/styles/steampunk-sample.png'
  },
  { 
    id: 'gothic', 
    name: 'Gothic', 
    description: 'Dark & dramatic', 
    icon: '🦇',
    sampleImage: '/images/styles/gothic-sample.png'
  },
  { 
    id: 'impressionist', 
    name: 'Impressionist', 
    description: 'Soft brushstrokes', 
    icon: '🌅',
    sampleImage: '/images/styles/impressionist-sample.png'
  },
  { 
    id: 'cartoon', 
    name: 'Cartoon', 
    description: 'Animated style', 
    icon: '🎭',
    sampleImage: '/images/styles/cartoon-sample.png'
  },
  { 
    id: 'realistic_portrait', 
    name: 'Portrait', 
    description: 'Professional headshot', 
    icon: '👤',
    sampleImage: '/images/styles/portrait-sample.png'
  },
  { 
    id: 'landscape', 
    name: 'Landscape', 
    description: 'Nature scenes', 
    icon: '🏞️',
    sampleImage: '/images/styles/landscape-sample.png'
  }
];

export default function StyleSelector({ selectedStyle, onStyleChange, disabled = false }: StyleSelectorProps) {
  const [showAll, setShowAll] = useState(false);
  
  const displayedStyles = showAll ? styles : styles.slice(0, 8);

  // Helper function to update a style's sample image
  const updateStyleImage = (styleId: string, newImageUrl: string) => {
    // This would be called when you want to replace a style's sample image
    console.log(`Updating ${styleId} with new image: ${newImageUrl}`);
    // You can call this function after generating each image
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold text-lg mb-4">Choose a Style</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {displayedStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleChange(style.id)}
            disabled={disabled}
            className={`relative overflow-hidden rounded-lg text-left transition-all duration-200 ${
              selectedStyle === style.id
                ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900'
                : 'hover:scale-105'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="relative">
              <img 
                src={style.sampleImage} 
                alt={style.name}
                className="w-full h-24 object-cover"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${
                selectedStyle === style.id 
                  ? 'from-cyan-600/80 to-blue-600/80' 
                  : 'from-black/60 to-transparent'
              }`} />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="text-white font-medium text-sm">{style.name}</div>
                <div className="text-white/80 text-xs">{style.description}</div>
              </div>
              {selectedStyle === style.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {!showAll && (
        <button
          onClick={() => setShowAll(true)}
          disabled={disabled}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
        >
          Show All Styles ({styles.length - 8} more)
        </button>
      )}
      
      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          disabled={disabled}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
        >
          Show Less
        </button>
      )}
    </div>
  );
}
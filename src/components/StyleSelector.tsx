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
    sampleImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'abstract', 
    name: 'Abstract', 
    description: 'Modern art', 
    icon: '🎨',
    sampleImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'anime', 
    name: 'Anime', 
    description: 'Japanese animation', 
    icon: '🎌',
    sampleImage: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'artistic', 
    name: 'Artistic', 
    description: 'Traditional art', 
    icon: '🖼️',
    sampleImage: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'cyberpunk', 
    name: 'Cyberpunk', 
    description: 'Futuristic neon', 
    icon: '🌃',
    sampleImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'fantasy', 
    name: 'Fantasy', 
    description: 'Magical worlds', 
    icon: '🧙‍♂️',
    sampleImage: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'vintage', 
    name: 'Vintage', 
    description: 'Retro classic', 
    icon: '📻',
    sampleImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'minimalist', 
    name: 'Minimalist', 
    description: 'Clean & simple', 
    icon: '⚪',
    sampleImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'watercolor', 
    name: 'Watercolor', 
    description: 'Soft painting', 
    icon: '🎨',
    sampleImage: 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'oil_painting', 
    name: 'Oil Painting', 
    description: 'Classical art', 
    icon: '🖌️',
    sampleImage: 'https://images.unsplash.com/photo-1578926375605-eaf7055397f6?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'digital_art', 
    name: 'Digital Art', 
    description: 'Modern digital', 
    icon: '💻',
    sampleImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'sketch', 
    name: 'Sketch', 
    description: 'Hand-drawn', 
    icon: '✏️',
    sampleImage: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'pop_art', 
    name: 'Pop Art', 
    description: 'Bold & vibrant', 
    icon: '🟡',
    sampleImage: 'https://images.unsplash.com/photo-1578662015118-a4b75b69b2ee?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'surreal', 
    name: 'Surreal', 
    description: 'Dreamlike', 
    icon: '🌙',
    sampleImage: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'steampunk', 
    name: 'Steampunk', 
    description: 'Victorian tech', 
    icon: '⚙️',
    sampleImage: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'gothic', 
    name: 'Gothic', 
    description: 'Dark & dramatic', 
    icon: '🦇',
    sampleImage: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab56e8?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'impressionist', 
    name: 'Impressionist', 
    description: 'Soft brushstrokes', 
    icon: '🌅',
    sampleImage: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'cartoon', 
    name: 'Cartoon', 
    description: 'Animated style', 
    icon: '🎭',
    sampleImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'realistic_portrait', 
    name: 'Portrait', 
    description: 'Professional headshot', 
    icon: '👤',
    sampleImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'landscape', 
    name: 'Landscape', 
    description: 'Nature scenes', 
    icon: '🏞️',
    sampleImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center'
  }
];

export default function StyleSelector({ selectedStyle, onStyleChange, disabled = false }: StyleSelectorProps) {
  const [showAll, setShowAll] = useState(false);
  
  const displayedStyles = showAll ? styles : styles.slice(0, 8);

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
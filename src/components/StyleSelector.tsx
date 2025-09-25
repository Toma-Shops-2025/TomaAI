import React, { useState } from 'react';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  disabled?: boolean;
}

const styles = [
  { id: 'photorealistic', name: 'Photorealistic', description: 'Lifelike photos', icon: '📸' },
  { id: 'abstract', name: 'Abstract', description: 'Modern art', icon: '🎨' },
  { id: 'anime', name: 'Anime', description: 'Japanese animation', icon: '🎌' },
  { id: 'artistic', name: 'Artistic', description: 'Traditional art', icon: '🖼️' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Futuristic neon', icon: '🌃' },
  { id: 'fantasy', name: 'Fantasy', description: 'Magical worlds', icon: '🧙‍♂️' },
  { id: 'vintage', name: 'Vintage', description: 'Retro classic', icon: '📻' },
  { id: 'minimalist', name: 'Minimalist', description: 'Clean & simple', icon: '⚪' },
  { id: 'watercolor', name: 'Watercolor', description: 'Soft painting', icon: '🎨' },
  { id: 'oil_painting', name: 'Oil Painting', description: 'Classical art', icon: '🖌️' },
  { id: 'digital_art', name: 'Digital Art', description: 'Modern digital', icon: '💻' },
  { id: 'sketch', name: 'Sketch', description: 'Hand-drawn', icon: '✏️' },
  { id: 'pop_art', name: 'Pop Art', description: 'Bold & vibrant', icon: '🟡' },
  { id: 'surreal', name: 'Surreal', description: 'Dreamlike', icon: '🌙' },
  { id: 'steampunk', name: 'Steampunk', description: 'Victorian tech', icon: '⚙️' },
  { id: 'gothic', name: 'Gothic', description: 'Dark & dramatic', icon: '🦇' },
  { id: 'impressionist', name: 'Impressionist', description: 'Soft brushstrokes', icon: '🌅' },
  { id: 'cartoon', name: 'Cartoon', description: 'Animated style', icon: '🎭' },
  { id: 'realistic_portrait', name: 'Portrait', description: 'Professional headshot', icon: '👤' },
  { id: 'landscape', name: 'Landscape', description: 'Nature scenes', icon: '🏞️' }
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
            className={`p-3 rounded-lg text-left transition-all duration-200 ${
              selectedStyle === style.id
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-2 border-cyan-400'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="text-2xl mb-1">{style.icon}</div>
            <div className="font-medium text-sm">{style.name}</div>
            <div className="text-xs opacity-75">{style.description}</div>
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

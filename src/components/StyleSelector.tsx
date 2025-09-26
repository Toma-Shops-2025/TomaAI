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
    sampleImage: 'https://images.unsplash.com/photo-1578662015118-a4b75b69b2ee?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'artistic', 
    name: 'Artistic', 
    description: 'Traditional art', 
    icon: '🖼️',
    sampleImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'cyberpunk', 
    name: 'Cyberpunk', 
    description: 'Futuristic neon', 
    icon: '🌃',
    sampleImage: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'fantasy', 
    name: 'Fantasy', 
    description: 'Magical worlds', 
    icon: '🧙‍♂️',
    sampleImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center'
  },
  { 
    id: 'vintage', 
    name: 'Vintage', 
    description: 'Retro classic', 
    icon: '📻',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-jYvDUAS4neDHbcUjPOMnQOB7.png?st=2025-09-25T22%3A50%3A09Z&se=2025-09-26T00%3A50%3A09Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=6e4237ed-4a31-4e1d-a677-4df21834ece0&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T12%3A58%3A18Z&ske=2025-09-26T12%3A58%3A18Z&sks=b&skv=2024-08-04&sig=%2BwcW8k0l35eioNIYIuZL3yUEYQoxLfBBaO087FOvawU%3D'
  },
  { 
    id: 'minimalist', 
    name: 'Minimalist', 
    description: 'Clean & simple', 
    icon: '⚪',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-6mlW6vO5whO46WQztbtiGfpk.png?st=2025-09-25T22%3A53%3A42Z&se=2025-09-26T00%3A53%3A42Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=6e4237ed-4a31-4e1d-a677-4df21834ece0&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T02%3A20%3A55Z&ske=2025-09-26T02%3A20%3A55Z&sks=b&skv=2024-08-04&sig=y7UfyW8ftS3JSVaHyK4GWS4893N0tdZm4iWUabPNfFI%3D'
  },
  { 
    id: 'watercolor', 
    name: 'Watercolor', 
    description: 'Soft painting', 
    icon: '🎨',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-jkCluqSsQejqoAsy7pnIXZKF.png?st=2025-09-25T22%3A57%3A05Z&se=2025-09-26T00%3A57%3A05Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=c6569cb0-0faa-463d-9694-97df3dc1dfb1&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T19%3A44%3A17Z&ske=2025-09-26T19%3A44%3A17Z&sks=b&skv=2024-08-04&sig=nQB9D0KYPlvirDjZCX2LzfsmmS5yvE3q69kfLwBJZ%2B0%3D'
  },
  { 
    id: 'oil_painting', 
    name: 'Oil Painting', 
    description: 'Classical art', 
    icon: '🖌️',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-GXReoQGismQ3GQWvhcyHuEo2.png?st=2025-09-25T23%3A00%3A43Z&se=2025-09-26T01%3A00%3A43Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=0e2a3d55-e963-40c9-9c89-2a1aa28cb3ac&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T20%3A24%3A37Z&ske=2025-09-26T20%3A24%3A37Z&sks=b&skv=2024-08-04&sig=L%2BGZJmTQJGMM99WDlF26H8Y9h2uyO1AcynYt%2B%2Bzt1sU%3D'
  },
  { 
    id: 'digital_art', 
    name: 'Digital Art', 
    description: 'Modern digital', 
    icon: '💻',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-IIBo8xYFQMsL4CDk2TPKL9t9.png?st=2025-09-25T23%3A05%3A02Z&se=2025-09-26T01%3A05%3A02Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=31d50bd4-689f-439b-a875-f22bd677744d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T19%3A05%3A43Z&ske=2025-09-26T19%3A05%3A43Z&sks=b&skv=2024-08-04&sig=UIuTSJtn6rIg1utaud4MYspBJ5lJI3ucchDypT8vqCg%3D'
  },
  { 
    id: 'sketch', 
    name: 'Sketch', 
    description: 'Hand-drawn', 
    icon: '✏️',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-K9Mr4KaA4USLVhyrzuMzWdRD.png?st=2025-09-25T23%3A13%3A47Z&se=2025-09-26T01%3A13%3A47Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=c6569cb0-0faa-463d-9694-97df3dc1dfb1&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T21%3A01%3A21Z&ske=2025-09-26T21%3A01%3A21Z&sks=b&skv=2024-08-04&sig=EMr1zVxLSQ8FYyW5SfT9%2BfbQ9xxy3yplNn7HGaBsVSY%3D'
  },
  { 
    id: 'pop_art', 
    name: 'Pop Art', 
    description: 'Bold & vibrant', 
    icon: '🟡',
    sampleImage: 'https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798672458_e88f61af.webp'
  },
  { 
    id: 'surreal', 
    name: 'Surreal', 
    description: 'Dreamlike', 
    icon: '🌙',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-WQ7rWpvu0lQ7GSTOw4C4ThqV.png?st=2025-09-25T23%3A21%3A46Z&se=2025-09-26T01%3A21%3A46Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=6e4237ed-4a31-4e1d-a677-4df21834ece0&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T13%3A59%3A16Z&ske=2025-09-26T13%3A59%3A16Z&sks=b&skv=2024-08-04&sig=wGNpyFtHD81ThEHPsSpTKe5F%2BuuXevDHPDVEb96e/7M%3D'
  },
  { 
    id: 'steampunk', 
    name: 'Steampunk', 
    description: 'Victorian tech', 
    icon: '⚙️',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-a4n2DXyQ9VmvMGSuPFDs2utr.png?st=2025-09-25T23%3A24%3A12Z&se=2025-09-26T01%3A24%3A12Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=0e2a3d55-e963-40c9-9c89-2a1aa28cb3ac&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-26T00%3A17%3A42Z&ske=2025-09-27T00%3A17%3A42Z&sks=b&skv=2024-08-04&sig=nzPetAEYwnm6yXJ4fsM6bzDRRgZEWGQRXOJkKsgDSh8%3D'
  },
  { 
    id: 'gothic', 
    name: 'Gothic', 
    description: 'Dark & dramatic', 
    icon: '🦇',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-vQVHf8IislC8aR3AfhfgSfGK.png?st=2025-09-25T23%3A27%3A26Z&se=2025-09-26T01%3A27%3A26Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=32836cae-d25f-4fe9-827b-1c8c59c442cc&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T21%3A36%3A03Z&ske=2025-09-26T21%3A36%3A03Z&sks=b&skv=2024-08-04&sig=ILngxrfVF6US/SBV6SUuAB88MBn2iroVJSuP5TeqMXs%3D'
  },
  { 
    id: 'impressionist', 
    name: 'Impressionist', 
    description: 'Soft brushstrokes', 
    icon: '🌅',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-DeL8Qzw0SkP2OPZAMBxEC8dp.png?st=2025-09-25T23%3A30%3A09Z&se=2025-09-26T01%3A30%3A09Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=32836cae-d25f-4fe9-827b-1c8c59c442cc&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T21%3A37%3A09Z&ske=2025-09-26T21%3A37%3A09Z&sks=b&skv=2024-08-04&sig=ONS2Z1Ms2VF%2B7ijpsYoJ1s5VozS5LMtut44HtkRybGo%3D'
  },
  { 
    id: 'cartoon', 
    name: 'Cartoon', 
    description: 'Animated style', 
    icon: '🎭',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-hRGPcvPHjznaCdtya4C6KIbR.png?st=2025-09-25T23%3A33%3A29Z&se=2025-09-26T01%3A33%3A29Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=38e27a3b-6174-4d3e-90ac-d7d9ad49543f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T23%3A25%3A46Z&ske=2025-09-26T23%3A25%3A46Z&sks=b&skv=2024-08-04&sig=nMrVnHeiuI7E8t6KBSXHHvudElUKuhy3/klBQUbzDrw%3D'
  },
  { 
    id: 'realistic_portrait', 
    name: 'Portrait', 
    description: 'Professional headshot', 
    icon: '👤',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-B2ATaZGYGSt2g7wdWc31NiIc.png?st=2025-09-25T23%3A39%3A12Z&se=2025-09-26T01%3A39%3A12Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=6e4237ed-4a31-4e1d-a677-4df21834ece0&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T12%3A58%3A18Z&ske=2025-09-26T12%3A58%3A18Z&sks=b&skv=2024-08-04&sig=FM1ypUi/pWgy4b594XuaU84JgXMy0uIq4SVxukyJ56w%3D'
  },
  { 
    id: 'landscape', 
    name: 'Landscape', 
    description: 'Nature scenes', 
    icon: '🏞️',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-CSPzazulZa1d2EvFeHEc62Gz.png?st=2025-09-25T23%3A43%3A48Z&se=2025-09-26T01%3A43%3A48Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=8eb2c87c-0531-4dab-acb3-b5e2adddce6c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T20%3A56%3A19Z&ske=2025-09-26T20%3A56%3A19Z&sks=b&skv=2024-08-04&sig=vXiic7mDa7qUxBp%2BD1NQk7rbvND3b8h4y8dv9A43Twk%3D'
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
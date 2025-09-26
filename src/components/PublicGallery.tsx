import React, { useState, useEffect } from 'react';
import ImageCard from './ImageCard';

interface GalleryImage {
  id: string;
  src: string;
  prompt: string;
  style: string;
  author: string;
  likes: number;
  createdAt: string;
}

export default function PublicGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate loading public gallery images
    // In a real implementation, you'd fetch from your database
    const loadGalleryImages = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock gallery data using actual style images
      const mockImages: GalleryImage[] = [
        {
          id: '1',
          src: '/images/styles/fantasy-sample.png',
          prompt: 'A majestic dragon flying over a mystical forest',
          style: 'fantasy',
          author: 'CreativeUser123',
          likes: 42,
          createdAt: '2025-01-20'
        },
        {
          id: '2',
          src: '/images/styles/cyberpunk-sample.png',
          prompt: 'Cyberpunk cityscape with neon lights',
          style: 'cyberpunk',
          author: 'TechArtist',
          likes: 38,
          createdAt: '2025-01-19'
        },
        {
          id: '3',
          src: '/images/styles/abstract-sample.png',
          prompt: 'Abstract geometric patterns in vibrant colors',
          style: 'abstract',
          author: 'AbstractMind',
          likes: 29,
          createdAt: '2025-01-18'
        }
      ];
      
      setImages(mockImages);
      setLoading(false);
    };

    loadGalleryImages();
  }, []);

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.style === filter);

  const handleDownload = (imageUrl: string, prompt: string) => {
    // Download functionality
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `gallery-${prompt.slice(0, 20)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVariation = (prompt: string, style: string) => {
    // Variation functionality - could open generation modal
    alert(`Creating variation of "${prompt}" in ${style} style`);
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-semibold text-xl">Community Gallery</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
        >
          <option value="all">All Styles</option>
          <option value="photorealistic">Photorealistic</option>
          <option value="fantasy">Fantasy</option>
          <option value="cyberpunk">Cyberpunk</option>
          <option value="abstract">Abstract</option>
          <option value="anime">Anime</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image) => (
          <div key={image.id} className="bg-slate-700 rounded-lg overflow-hidden">
            <ImageCard
              src={image.src}
              prompt={image.prompt}
              style={image.style}
              onDownload={handleDownload}
              onVariation={handleVariation}
            />
            <div className="p-3">
              <div className="flex justify-between items-center text-sm text-gray-300">
                <span>by {image.author}</span>
                <span>❤️ {image.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No images found for this filter.</p>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import ImageCard from './ImageCard';
import StylePreset from './StylePreset';
import GenerationControls from './GenerationControls';
import PromptInput from './PromptInput';
import AuthModal from './AuthModal';
import PricingModal from './PricingModal';
import { useSupabase } from '@/contexts/SupabaseContext';
import { GeneratedImage } from '@/lib/supabase';

export default function AppLayout() {
  const { user, saveGeneratedImage, getGeneratedImages } = useSupabase();
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('high');
  const [numImages, setNumImages] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [savedImages, setSavedImages] = useState<GeneratedImage[]>([]);

  const heroImage = "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798663042_bb4db978.webp";

  const sampleImages = [
    { src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798664450_707e4044.webp", prompt: "Professional portrait with studio lighting", style: "Photorealistic" },
    { src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798666349_af2b315f.webp", prompt: "Elegant woman with flowing hair", style: "Photorealistic" },
    { src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798669968_cfa053e4.png", prompt: "Artistic portrait photography", style: "Photorealistic" },
    { src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798670734_a3f481a4.webp", prompt: "Colorful geometric abstract art", style: "Abstract" },
    { src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798672458_e88f61af.webp", prompt: "Modern digital art composition", style: "Abstract" },
    { src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798674959_dc7acc81.webp", prompt: "Vibrant abstract patterns", style: "Abstract" },
    { src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798676677_dc380a77.webp", prompt: "Geometric shapes and colors", style: "Abstract" },
    { src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798677373_64253ec6.webp", prompt: "Anime character illustration", style: "Anime" },
    { src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798679083_ff833edc.webp", prompt: "Detailed anime artwork", style: "Anime" },
    { src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798680807_fbde0029.webp", prompt: "Colorful anime style character", style: "Anime" },
    { src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798681591_dc98035f.webp", prompt: "Impressionist landscape painting", style: "Artistic" },
    { src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798683320_fa3a7f3f.webp", prompt: "Traditional art style landscape", style: "Artistic" }
  ];

  const stylePresets = [
    { name: 'Photorealistic', description: 'Lifelike photos', previewImage: sampleImages[0].src },
    { name: 'Abstract', description: 'Modern art', previewImage: sampleImages[3].src },
    { name: 'Anime', description: 'Japanese animation', previewImage: sampleImages[7].src },
    { name: 'Artistic', description: 'Traditional art', previewImage: sampleImages[10].src }
  ];

  // Load saved images on component mount
  useEffect(() => {
    const loadSavedImages = async () => {
      if (user) {
        const images = await getGeneratedImages();
        setSavedImages(images);
      }
    };
    loadSavedImages();
  }, [user, getGeneratedImages]);

  const handleGenerate = async (prompt: string, negativePrompt: string) => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(async () => {
      const newImage = {
        src: sampleImages[Math.floor(Math.random() * sampleImages.length)].src,
        prompt,
        style: selectedStyle
      };
      setGeneratedImages(prev => [newImage, ...prev]);
      
      // Save to Supabase if user is logged in
      if (user) {
        await saveGeneratedImage({
          user_id: user.id,
          prompt,
          negative_prompt: negativePrompt,
          style: selectedStyle,
          aspect_ratio: aspectRatio,
          quality,
          image_url: newImage.src
        });
      }
      
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownload = () => {
    alert('Download started! (This would download the image in a real app)');
  };

  const handleVariation = () => {
    alert('Creating variation... (This would generate a similar image)');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Toma<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span>
          </h1>
          <div className="flex items-center gap-4">
            <PricingModal />
            <AuthModal />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="AI Generated Art" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              AI Image
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Generator</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your imagination into stunning visuals with our advanced AI technology. 
              Create professional artwork, portraits, and designs in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generation */}
          <div className="lg:col-span-2 space-y-8">
            <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
            
            {/* Style Presets */}
            <div>
              <h3 className="text-white font-semibold text-xl mb-4">Choose a Style</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stylePresets.map((style) => (
                  <StylePreset
                    key={style.name}
                    name={style.name}
                    description={style.description}
                    previewImage={style.previewImage}
                    isSelected={selectedStyle === style.name.toLowerCase()}
                    onClick={() => setSelectedStyle(style.name.toLowerCase())}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Controls */}
          <div>
            <GenerationControls
              aspectRatio={aspectRatio}
              quality={quality}
              numImages={numImages}
              onAspectRatioChange={setAspectRatio}
              onQualityChange={setQuality}
              onNumImagesChange={setNumImages}
            />
          </div>
        </div>

        {/* Saved Images for logged-in users */}
        {user && savedImages.length > 0 && (
          <div className="mt-12">
            <h3 className="text-white font-semibold text-2xl mb-6">Your Saved Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedImages.map((image) => (
                <ImageCard
                  key={image.id}
                  src={image.image_url}
                  prompt={image.prompt}
                  style={image.style}
                  onDownload={handleDownload}
                  onVariation={handleVariation}
                />
              ))}
            </div>
          </div>
        )}

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="mt-12">
            <h3 className="text-white font-semibold text-2xl mb-6">Your Generated Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {generatedImages.map((image, index) => (
                <ImageCard
                  key={index}
                  src={image.src}
                  prompt={image.prompt}
                  style={image.style}
                  onDownload={handleDownload}
                  onVariation={handleVariation}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sample Gallery */}
        <div className="mt-12">
          <h3 className="text-white font-semibold text-2xl mb-6">Explore AI-Generated Art</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleImages.map((image, index) => (
              <ImageCard
                key={index}
                src={image.src}
                prompt={image.prompt}
                style={image.style}
                onDownload={handleDownload}
                onVariation={handleVariation}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
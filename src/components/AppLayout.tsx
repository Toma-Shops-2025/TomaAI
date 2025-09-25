import React, { useState, useEffect } from 'react';
import ImageCard from './ImageCard';
import StylePreset from './StylePreset';
import GenerationControls from './GenerationControls';
import StyleSelector from './StyleSelector';
import PromptInput from './PromptInput';
import AuthModal from './AuthModal';
import PricingModal from './PricingModal';
import { useSupabase } from '@/contexts/SupabaseContext';
import { GeneratedImage } from '@/lib/supabase';
import { generateImages, getSampleImage } from '@/lib/openai';
import { canGenerateImage, getRemainingImages, isTrialActive } from '@/lib/subscription';

export default function AppLayout() {
  const { user, saveGeneratedImage, getGeneratedImages } = useSupabase();
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('high');
  const [numImages, setNumImages] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [savedImages, setSavedImages] = useState<GeneratedImage[]>([]);
  const [userSubscription, setUserSubscription] = useState({
    tier: 'free',
    imagesUsed: 0,
    trialEndsAt: null as string | null,
    emailCollected: false
  });
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');

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
    // Check subscription status
    if (user) {
      const canGenerate = canGenerateImage(userSubscription.tier, userSubscription.imagesUsed);
      const isTrial = isTrialActive(userSubscription.trialEndsAt);
      
      if (!canGenerate && !isTrial) {
        alert('You have reached your image limit. Please upgrade your plan to generate more images.');
        return;
      }
    } else {
      // For non-logged in users, check if they've provided email for free images
      if (!userSubscription.emailCollected && generatedImages.length >= 3) {
        alert('Please provide your email to continue generating free images or sign up for a plan.');
        return;
      }
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStatus('Initializing AI generation...');
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);
    
    // Update status messages
    const statusInterval = setInterval(() => {
      setGenerationStatus(prev => {
        const messages = [
          'Analyzing your prompt...',
          'Generating creative concepts...',
          'Rendering your image...',
          'Adding final touches...',
          'Almost ready...'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        return randomMessage;
      });
    }, 1000);
    
    try {
      // Try to generate with OpenAI API
      const result = await generateImages({
        prompt,
        negativePrompt,
        style: selectedStyle,
        aspectRatio,
        quality,
        numImages
      });

      if (result.success && result.images.length > 0) {
        // Complete progress
        setGenerationProgress(100);
        setGenerationStatus('Image generated successfully!');
        
        // Use real generated images
        const newImages = result.images.map(imageUrl => ({
          src: imageUrl,
          prompt,
          style: selectedStyle
        }));
        
        setGeneratedImages(prev => [...newImages, ...prev]);
        
        // Save to Supabase if user is logged in
        if (user) {
          for (const image of newImages) {
            await saveGeneratedImage({
              user_id: user.id,
              prompt,
              negative_prompt: negativePrompt,
              style: selectedStyle,
              aspect_ratio: aspectRatio,
              quality,
              image_url: image.src
            });
          }
        }
      } else {
        // Fallback to sample images if API fails
        console.warn('API generation failed, using sample images:', result.error);
        const fallbackImage = {
          src: getSampleImage(),
          prompt,
          style: selectedStyle
        };
        
        setGeneratedImages(prev => [fallbackImage, ...prev]);
        
        // Save to Supabase if user is logged in
        if (user) {
          await saveGeneratedImage({
            user_id: user.id,
            prompt,
            negative_prompt: negativePrompt,
            style: selectedStyle,
            aspect_ratio: aspectRatio,
            quality,
            image_url: fallbackImage.src
          });
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      // Fallback to sample images
      const fallbackImage = {
        src: getSampleImage(),
        prompt,
        style: selectedStyle
      };
      
      setGeneratedImages(prev => [fallbackImage, ...prev]);
    } finally {
      // Clear intervals
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      
      // Reset state after a short delay to show completion
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
        setGenerationStatus('');
      }, 2000);
    }
  };

  const handleDownload = (imageUrl: string, prompt: string) => {
    // Create a temporary link element to download the image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `tomaai-${prompt.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVariation = () => {
    alert('Creating variation... (This would generate a similar image)');
  };

  const handleEmailCollection = (email: string) => {
    // Update subscription state to show email collected
    setUserSubscription(prev => ({
      ...prev,
      emailCollected: true
    }));
    
    // Here you would typically save the email to your database
    // For now, we'll just update the local state
    console.log('Email collected:', email);
    
    // You could also send a welcome email here
    // sendWelcomeEmail(email);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Toma<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI</span>
          </h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-white text-sm">
                {userSubscription.tier === 'free' ? (
                  <span className="bg-slate-600 px-3 py-1 rounded-full text-xs font-medium">Free Plan</span>
                ) : (
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 rounded-full text-xs font-medium">
                    {userSubscription.tier.charAt(0).toUpperCase() + userSubscription.tier.slice(1)} Plan
                  </span>
                )}
              </div>
            )}
            <PricingModal />
            <AuthModal />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="AI Generated Art" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              AI Image
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> Generator</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
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
            <PromptInput 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating}
              userTier={userSubscription.tier}
              imagesUsed={userSubscription.imagesUsed}
              maxImages={userSubscription.tier === 'free' ? 3 : userSubscription.tier === 'enterprise' ? -1 : userSubscription.tier === 'starter' ? 50 : 200}
              generationProgress={generationProgress}
              generationStatus={generationStatus}
              onEmailCollection={handleEmailCollection}
            />
            
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
              disabled={isGenerating}
            />
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
                  onDownload={(imageUrl, prompt) => handleDownload(imageUrl, prompt)}
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
                  onDownload={(imageUrl, prompt) => handleDownload(imageUrl, prompt)}
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
                onDownload={(imageUrl, prompt) => handleDownload(imageUrl, prompt)}
                onVariation={handleVariation}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
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
import { downloadAndStoreImage, createStorageBucket } from '@/lib/imageStorage';
import { generateImages, getSampleImage } from '@/lib/openai';
import { canGenerateImage, getRemainingImages, isTrialActive } from '@/lib/subscription';
import FloatingHomeButton from './FloatingHomeButton';
import BackgroundRemoval from './BackgroundRemoval';
import ImageToImage from './ImageToImage';
import PublicGallery from './PublicGallery';
import ExtendedPricingModal from './ExtendedPricingModal';

export default function AppLayout() {
  const { user, saveGeneratedImage, getGeneratedImages, signOut } = useSupabase();
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
  const [showExtendedPricing, setShowExtendedPricing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');

  const heroImage = "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798663042_bb4db978.webp";

  const [sampleImages, setSampleImages] = useState([
    { id: 1, src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798664450_707e4044.webp", prompt: "Professional portrait with studio lighting", style: "Photorealistic" },
    { id: 2, src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798666349_af2b315f.webp", prompt: "Elegant woman with flowing hair", style: "Photorealistic" },
    { id: 3, src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798669968_cfa053e4.png", prompt: "Artistic portrait photography", style: "Photorealistic" },
    { id: 4, src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798670734_a3f481a4.webp", prompt: "Colorful geometric abstract art", style: "Abstract" },
    { id: 5, src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798672458_e88f61af.webp", prompt: "Modern digital art composition", style: "Abstract" },
    { id: 6, src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798674959_dc7acc81.webp", prompt: "Vibrant abstract patterns", style: "Abstract" }
  ]);

  const removeSampleImage = (id: number) => {
    setSampleImages(prev => prev.filter(img => img.id !== id));
  };

  const stylePresets = [
    { name: 'Photorealistic', description: 'Lifelike photos', previewImage: sampleImages[0]?.src || '' },
    { name: 'Abstract', description: 'Modern art', previewImage: sampleImages[3]?.src || '' },
    { name: 'Anime', description: 'Japanese animation', previewImage: sampleImages[7]?.src || '' },
    { name: 'Artistic', description: 'Traditional art', previewImage: sampleImages[10]?.src || '' }
  ];

  // Load saved images on component mount
  useEffect(() => {
    const loadSavedImages = async () => {
      if (user) {
        const images = await getGeneratedImages();
        setSavedImages(images);
      } else {
        // Reset saved images when user logs out
        setSavedImages([]);
      }
    };
    loadSavedImages();
  }, [user, getGeneratedImages]);

  // Update imagesUsed count when savedImages changes
  useEffect(() => {
    if (!user) {
      // Reset counter for non-authenticated users
      setUserSubscription(prev => ({
        ...prev,
        imagesUsed: 0
      }));
      return;
    }

    // Only count images for the current user
    const userImages = savedImages.filter(img => img.user_id === user.id);
    
    console.log('Debug - User images count:', userImages.length, 'Total saved images:', savedImages.length, 'User ID:', user.id);
    
    // Cap the imagesUsed at the tier limit to prevent display issues
    const tierLimit = userSubscription.tier === 'free' ? 3 : 
                     userSubscription.tier === 'starter' ? 50 : 
                     userSubscription.tier === 'pro' ? 200 : -1;
    
    const actualUsed = Math.min(userImages.length, tierLimit === -1 ? userImages.length : tierLimit);
    
    setUserSubscription(prev => ({
      ...prev,
      imagesUsed: actualUsed
    }));
  }, [savedImages, userSubscription.tier, user]);

  // Initialize storage bucket
  useEffect(() => {
    createStorageBucket();
  }, []);

  const handleGenerate = async (prompt: string, negativePrompt: string) => {
    // Require authentication for image generation
    if (!user) {
      alert('Please sign in to generate images. You can create a free account to get started.');
      setShowAuthModal(true);
      return;
    }

    // Check subscription status for authenticated users
    const canGenerate = canGenerateImage(userSubscription.tier, userSubscription.imagesUsed);
    const isTrial = isTrialActive(userSubscription.trialEndsAt);
    
    if (!canGenerate && !isTrial) {
      // For free users who have used all 3 images, show pricing options
      if (userSubscription.tier === 'free') {
        setShowExtendedPricing(true);
        return;
      } else {
        alert('You have reached your image limit. Please upgrade your plan to generate more images.');
        setShowPricingModal(true);
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
        
        // Store images permanently and use real generated images
        const newImages: GeneratedImage[] = [];
        for (const imageUrl of result.images) {
          // Download and store the image permanently
          const permanentUrl = await downloadAndStoreImage(imageUrl, prompt, selectedStyle);
          
          newImages.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            user_id: user?.id,
            prompt,
            negative_prompt: negativePrompt,
            style: selectedStyle,
            aspect_ratio: aspectRatio,
            quality,
            image_url: permanentUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        
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
              image_url: image.image_url || ''
            });
          }
          // Reload saved images to update the counter
          const savedImages = await getGeneratedImages();
          setSavedImages(savedImages);
        }
      } else {
        // Fallback to sample images if API fails
        console.warn('API generation failed, using sample images:', result.error);
        const fallbackImage: GeneratedImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          user_id: user?.id,
          prompt,
          negative_prompt: negativePrompt,
          style: selectedStyle,
          aspect_ratio: aspectRatio,
          quality,
          image_url: getSampleImage(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
            image_url: fallbackImage.image_url || ''
          });
          // Reload saved images to update the counter
          const savedImages = await getGeneratedImages();
          setSavedImages(savedImages);
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      // Fallback to sample images
      const fallbackImage: GeneratedImage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        user_id: user?.id,
        prompt,
        negative_prompt: negativePrompt,
        style: selectedStyle,
        aspect_ratio: aspectRatio,
        quality,
        image_url: getSampleImage(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
          image_url: fallbackImage.image_url || ''
        });
        // Reload saved images to update the counter
        const savedImages = await getGeneratedImages();
        setSavedImages(savedImages);
      }
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

  const handleVariation = (originalPrompt: string, originalStyle: string) => {
    // Create a variation prompt by adding variation keywords
    const variationPrompt = `${originalPrompt}, variation, similar but different, alternative version`;
    
    // Use the same generation logic but with the variation prompt
    handleGenerate(variationPrompt, '');
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
          <div className="flex items-center">
            <img 
              src="/icon-512x512.png" 
              alt="TomaAI" 
              className="h-32 w-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-white text-sm">
                  {userSubscription.tier === 'free' ? (
                    <span className="bg-slate-600 px-3 py-1 rounded-full text-xs font-medium">Free Plan</span>
                  ) : (
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 rounded-full text-xs font-medium">
                      {userSubscription.tier.charAt(0).toUpperCase() + userSubscription.tier.slice(1)} Plan
                    </span>
                  )}
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
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
      <div className="max-w-7xl mx-auto px-4 py-12 overflow-x-hidden">
        {/* Feature Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'generate'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Generate Images
            </button>
            <button
              onClick={() => setActiveTab('background')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'background'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Remove Background
            </button>
            <button
              onClick={() => setActiveTab('image-to-image')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'image-to-image'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Image-to-Image
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'gallery'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Community Gallery
            </button>
            <button
              onClick={() => setShowExtendedPricing(true)}
              className="px-4 py-2 rounded-md font-medium bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 transition-all"
            >
              Extended Pricing
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-x-hidden">
          {/* Left Column - Generation */}
          <div className="lg:col-span-2 space-y-8">
            {!user ? (
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
                <div className="mb-6">
                  <img
                    src="/icon-512x512.png"
                    alt="TomaAI"
                    className="h-16 w-16 mx-auto mb-4"
                  />
                  <h3 className="text-2xl font-bold text-white mb-2">Welcome to TomaAI</h3>
                  <p className="text-gray-300 mb-6">
                    Create stunning AI-generated images with our advanced technology. 
                    Sign in to get started with 3 free images!
                  </p>
                </div>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-md transition-all transform hover:scale-105"
                >
                  Sign In to Get Started
                </button>
              </div>
            ) : (
              <>
                <PromptInput 
                  onGenerate={handleGenerate} 
                  isGenerating={isGenerating}
                  userTier={userSubscription.tier}
                  imagesUsed={userSubscription.imagesUsed}
                  maxImages={userSubscription.tier === 'free' ? 3 : userSubscription.tier === 'enterprise' ? -1 : userSubscription.tier === 'starter' ? 50 : 200}
                  generationProgress={generationProgress}
                  generationStatus={generationStatus}
                  onEmailCollection={handleEmailCollection}
                  onShowPricing={() => setShowExtendedPricing(true)}
                  emailCollected={userSubscription.emailCollected}
                />
                
                <StyleSelector
                  selectedStyle={selectedStyle}
                  onStyleChange={setSelectedStyle}
                  disabled={isGenerating}
                />
              </>
            )}
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

            {/* Saved Images for logged-in users */}
            {user && savedImages.length > 0 && (
              <div className="mt-12">
                <h3 className="text-white font-semibold text-2xl mb-6">Your Saved Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {savedImages.map((image) => (
                    <ImageCard
                      key={image.id}
                      src={image.image_url || ''}
                      prompt={image.prompt || ''}
                      style={image.style || ''}
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
                      src={image.image_url || ''}
                      prompt={image.prompt || ''}
                      style={image.style || ''}
                      onDownload={(imageUrl, prompt) => handleDownload(imageUrl, prompt)}
                      onVariation={handleVariation}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sample Gallery */}
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold text-2xl">Explore AI-Generated Art</h3>
                <button
                  onClick={() => setSampleImages([])}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Clear All Samples
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sampleImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <ImageCard
                      src={image.src || ''}
                      prompt={image.prompt || ''}
                      style={image.style || ''}
                      onDownload={(imageUrl, prompt) => handleDownload(imageUrl, prompt)}
                      onVariation={handleVariation}
                    />
                    <button
                      onClick={() => removeSampleImage(image.id)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove this sample"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {sampleImages.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No sample images to display.</p>
                  <button
                    onClick={() => setSampleImages([
                      { id: 1, src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798664450_707e4044.webp", prompt: "Professional portrait with studio lighting", style: "Photorealistic" },
                      { id: 2, src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798666349_af2b315f.webp", prompt: "Elegant woman with flowing hair", style: "Photorealistic" },
                      { id: 3, src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798669968_cfa053e4.png", prompt: "Artistic portrait photography", style: "Photorealistic" },
                      { id: 4, src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798670734_a3f481a4.webp", prompt: "Colorful geometric abstract art", style: "Abstract" },
                      { id: 5, src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798672458_e88f61af.webp", prompt: "Modern digital art composition", style: "Abstract" },
                      { id: 6, src: "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798674959_dc7acc81.webp", prompt: "Vibrant abstract patterns", style: "Abstract" }
                    ])}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Restore Sample Images
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Background Removal Tab */}
        {activeTab === 'background' && (
          <div className="max-w-2xl mx-auto">
            {!user ? (
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
                <div className="mb-6">
                  <img
                    src="/icon-512x512.png"
                    alt="TomaAI"
                    className="h-16 w-16 mx-auto mb-4"
                  />
                  <h3 className="text-2xl font-bold text-white mb-2">Sign In Required</h3>
                  <p className="text-gray-300 mb-6">
                    Please sign in to use the background removal feature.
                  </p>
                </div>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-md transition-all transform hover:scale-105"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <BackgroundRemoval 
                onImageProcessed={(imageUrl) => {
                  // Handle processed image
                  console.log('Background removed:', imageUrl);
                }}
                disabled={isGenerating}
              />
            )}
          </div>
        )}

        {/* Image-to-Image Tab */}
        {activeTab === 'image-to-image' && (
          <div className="max-w-2xl mx-auto">
            {!user ? (
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
                <div className="mb-6">
                  <img
                    src="/icon-512x512.png"
                    alt="TomaAI"
                    className="h-16 w-16 mx-auto mb-4"
                  />
                  <h3 className="text-2xl font-bold text-white mb-2">Sign In Required</h3>
                  <p className="text-gray-300 mb-6">
                    Please sign in to use the image-to-image generation feature.
                  </p>
                </div>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-md transition-all transform hover:scale-105"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <ImageToImage 
                onImageGenerated={(imageUrl, prompt) => {
                  // Handle generated image
                  console.log('Generated from image:', imageUrl, prompt);
                }}
                disabled={isGenerating}
              />
            )}
          </div>
        )}

        {/* Community Gallery Tab */}
        {activeTab === 'gallery' && (
          <PublicGallery />
        )}
      </div>
      
      {/* Floating Home Button */}
      <FloatingHomeButton />
      
      {/* Extended Pricing Modal */}
      <ExtendedPricingModal 
        isOpen={showExtendedPricing}
        onClose={() => setShowExtendedPricing(false)}
      />
    </div>
  );
}
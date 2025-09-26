import React, { useState } from 'react';

interface ImageToImageProps {
  onImageGenerated: (imageUrl: string, prompt: string) => void;
  disabled?: boolean;
}

export default function ImageToImage({ onImageGenerated, disabled = false }: ImageToImageProps) {
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateFromImage = async () => {
    if (!referenceImage || !prompt.trim()) return;

    setIsGenerating(true);
    
    try {
      // Simulate image-to-image generation
      // In a real implementation, you'd call OpenAI's image-to-image API
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // For demo purposes, return a placeholder
      // In production, this would be the AI-generated image based on the reference
      const generatedImageUrl = 'https://via.placeholder.com/512x512/4F46E5/FFFFFF?text=Generated+Image';
      
      onImageGenerated(generatedImageUrl, prompt);
      
    } catch (error) {
      console.error('Image generation failed:', error);
      alert('Image generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-white font-semibold text-lg mb-4">Image-to-Image Generation</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reference Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer cursor-pointer"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe what you want to change
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., make it more colorful, add a sunset background, change the style to anime..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
            disabled={disabled}
          />
        </div>

        {referenceImage && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-300 mb-2">Reference Image:</p>
              <img 
                src={referenceImage} 
                alt="Reference" 
                className="w-full h-32 object-cover rounded-md"
              />
            </div>

            <button
              onClick={generateFromImage}
              disabled={isGenerating || disabled || !prompt.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Generate from Image'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

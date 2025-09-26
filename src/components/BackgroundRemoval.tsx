import React, { useState } from 'react';

interface BackgroundRemovalProps {
  onImageProcessed: (processedImageUrl: string) => void;
  disabled?: boolean;
}

export default function BackgroundRemoval({ onImageProcessed, disabled = false }: BackgroundRemovalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processBackgroundRemoval = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    
    try {
      // Simulate background removal processing
      // In a real implementation, you'd call an AI service like Remove.bg API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, return the original image
      // In production, this would be the processed image with background removed
      onImageProcessed(uploadedImage);
      
    } catch (error) {
      console.error('Background removal failed:', error);
      alert('Background removal failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-white font-semibold text-lg mb-4">Remove Background</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
            disabled={disabled}
          />
        </div>

        {uploadedImage && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-2">Original:</p>
                <img 
                  src={uploadedImage} 
                  alt="Original" 
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            </div>

            <button
              onClick={processBackgroundRemoval}
              disabled={isProcessing || disabled}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isProcessing ? 'Removing Background...' : 'Remove Background'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

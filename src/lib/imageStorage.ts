// Image storage utilities to handle DALL-E URL expiration
import { supabase } from './supabase';

export async function downloadAndStoreImage(imageUrl: string, prompt: string, style: string): Promise<string> {
  try {
    // Download the image from DALL-E URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to download image');
    }
    
    const blob = await response.blob();
    
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `tomaai-${prompt.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30)}-${timestamp}.png`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('generated-images')
      .upload(filename, blob, {
        contentType: 'image/png',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading to Supabase:', error);
      // Fallback to the original URL
      return imageUrl;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('generated-images')
      .getPublicUrl(filename);
    
    return publicUrl;
    
  } catch (error) {
    console.error('Error storing image:', error);
    // Fallback to the original URL
    return imageUrl;
  }
}

export async function createStorageBucket(): Promise<void> {
  try {
    const { data, error } = await supabase.storage.createBucket('generated-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (error && !error.message.includes('already exists')) {
      console.error('Error creating storage bucket:', error);
    }
  } catch (error) {
    console.error('Error setting up storage:', error);
  }
}

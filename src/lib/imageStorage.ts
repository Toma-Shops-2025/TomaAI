// Image storage utilities to handle DALL-E URL expiration
import { supabase } from './supabase';

export async function downloadAndStoreImage(imageUrl: string, prompt: string, style: string): Promise<string> {
  try {
    // Check if this is a DALL-E URL that might expire
    if (imageUrl.includes('oaidalleapiprodscus.blob.core.windows.net')) {
      console.log('DALL-E URL detected - CORS prevents direct download, using original URL:', imageUrl);
      
      // For now, return the original URL since CORS prevents direct download
      // TODO: Implement server-side proxy to download and store images
      console.warn('⚠️ DALL-E URLs expire after 2 hours. Server-side storage needed to prevent CORS issues.');
      return imageUrl;
    }

    // For other URLs, try to store them
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    const fileName = `${Date.now()}-${prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    
    const { data, error } = await supabase.storage
      .from('generated-images')
      .upload(fileName, blob, {
        contentType: 'image/png',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return imageUrl; // Fallback to original URL
    }

    const { data: { publicUrl } } = supabase.storage
      .from('generated-images')
      .getPublicUrl(fileName);

    console.log('Image stored successfully:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('Error storing image:', error);
    return imageUrl; // Fallback to original URL
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
      console.log('Please create the "generated-images" bucket manually in Supabase Dashboard');
    } else {
      console.log('✅ Storage bucket ready');
    }
  } catch (error) {
    console.error('Error setting up storage:', error);
    console.log('Please create the "generated-images" bucket manually in Supabase Dashboard');
  }
}

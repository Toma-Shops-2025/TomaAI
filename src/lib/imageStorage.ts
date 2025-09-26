// Image storage utilities to handle DALL-E URL expiration
import { supabase } from './supabase';

export async function downloadAndStoreImage(imageUrl: string, prompt: string, style: string): Promise<string> {
  try {
    // Check if this is a DALL-E URL that might expire
    if (imageUrl.includes('oaidalleapiprodscus.blob.core.windows.net')) {
      console.log('DALL-E URL detected - will expire in 2 hours:', imageUrl);
      
      // For now, return the original URL but log the expiration warning
      console.warn('⚠️ DALL-E URLs expire after 2 hours. Consider implementing server-side storage.');
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
    // Temporarily disable storage until bucket is created via dashboard
    console.log('Storage disabled - please create "generated-images" bucket in Supabase Dashboard');
    return;

    // Uncomment this after creating the bucket via dashboard:
    /*
    const { data, error } = await supabase.storage.createBucket('generated-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (error && !error.message.includes('already exists')) {
      console.error('Error creating storage bucket:', error);
    } else {
      console.log('Storage bucket ready');
    }
    */
  } catch (error) {
    console.error('Error setting up storage:', error);
  }
}

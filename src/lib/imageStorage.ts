// Image storage utilities to handle DALL-E URL expiration
import { supabase } from './supabase';

export async function downloadAndStoreImage(imageUrl: string, prompt: string, style: string): Promise<string> {
  try {
    // Temporarily skip storage due to CORS issues with DALL-E URLs
    // DALL-E images have CORS restrictions that prevent direct download
    console.log('Using original DALL-E URL due to CORS restrictions:', imageUrl);
    return imageUrl;
    
    // TODO: Implement server-side image download to avoid CORS issues
    // This would require a backend endpoint that downloads the image server-side
    // and then uploads it to Supabase Storage
    
  } catch (error) {
    console.error('Error storing image:', error);
    // Fallback to the original URL
    return imageUrl;
  }
}

export async function createStorageBucket(): Promise<void> {
  try {
    // Temporarily skip bucket creation due to RLS policy issues
    console.log('Skipping storage bucket creation due to RLS policy issues');
    return;
    
    // TODO: Fix RLS policies and re-enable storage
    /*
    const { data, error } = await supabase.storage.createBucket('generated-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (error && !error.message.includes('already exists')) {
      console.error('Error creating storage bucket:', error);
    }
    */
  } catch (error) {
    console.error('Error setting up storage:', error);
  }
}

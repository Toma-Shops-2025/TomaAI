-- Fix Supabase Storage RLS Policies for TomaAI
-- Run this in your Supabase SQL Editor

-- 1. Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own files" ON storage.objects;

-- 2. Create the generated-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'generated-images',
  'generated-images',
  true,
  10485760, -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Create RLS policies for the generated-images bucket

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'generated-images');

-- Allow authenticated users to view files
CREATE POLICY "Allow authenticated users to view files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'generated-images');

-- Allow public to view files (for public gallery)
CREATE POLICY "Allow public to view files" ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'generated-images');

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated users to delete their own files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'generated-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 5. Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

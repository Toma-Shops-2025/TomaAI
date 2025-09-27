-- TomaAI Database Schema for Supabase
-- Run these commands in your Supabase SQL editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;

-- Create generated_images table
CREATE TABLE IF NOT EXISTS generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  style VARCHAR(50) NOT NULL DEFAULT 'photorealistic',
  aspect_ratio VARCHAR(10) NOT NULL DEFAULT '1:1',
  quality VARCHAR(20) NOT NULL DEFAULT 'high',
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extended user profile)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  subscription_tier VARCHAR(20) DEFAULT 'free',
  subscription_status VARCHAR(20) DEFAULT 'active',
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  email_collected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_generated_images_user_id ON generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at ON generated_images(created_at);
CREATE INDEX IF NOT EXISTS idx_generated_images_style ON generated_images(style);

-- Row Level Security Policies

-- Users can only see their own generated images
CREATE POLICY "Users can view own generated images" ON generated_images
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own generated images
CREATE POLICY "Users can insert own generated images" ON generated_images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own generated images
CREATE POLICY "Users can update own generated images" ON generated_images
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own generated images
CREATE POLICY "Users can delete own generated images" ON generated_images
  FOR DELETE USING (auth.uid() = user_id);

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at
CREATE TRIGGER update_generated_images_updated_at
  BEFORE UPDATE ON generated_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

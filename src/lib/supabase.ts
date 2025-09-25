import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://irzzehvrytkunrxqniuo.supabase.co'
// You'll need to replace this with your actual Supabase anon key
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyenplaHZyeXRrdW5yeHFuaXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NzQ4MDAsImV4cCI6MjA1MTU1MDgwMH0.placeholder-key-replace-with-actual'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface GeneratedImage {
  id: string
  user_id?: string
  prompt: string
  negative_prompt?: string
  style: string
  aspect_ratio: string
  quality: string
  image_url: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

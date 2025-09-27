-- Migration script to add email_collected column to existing users table
-- Run this in your Supabase SQL editor if the column doesn't exist yet

-- Add email_collected column to users table if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_collected BOOLEAN DEFAULT FALSE;

-- Update existing users to have email_collected = false by default
UPDATE users 
SET email_collected = FALSE 
WHERE email_collected IS NULL;

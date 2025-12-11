-- ============================================
-- User Authentication & Data Sync Schema
-- ============================================
-- Run this in your Supabase SQL Editor AFTER setting up auth
-- ============================================

-- Create user_map_data table to store each user's map data
CREATE TABLE IF NOT EXISTS user_map_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  countries_data JSONB DEFAULT '{}'::jsonb,
  tags_data JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_map_data_user_id ON user_map_data(user_id);

-- Enable Row Level Security
ALTER TABLE user_map_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON user_map_data;
DROP POLICY IF EXISTS "Users can insert own data" ON user_map_data;
DROP POLICY IF EXISTS "Users can update own data" ON user_map_data;
DROP POLICY IF EXISTS "Users can delete own data" ON user_map_data;

-- Create RLS policies - users can only access their own data
CREATE POLICY "Users can view own data" ON user_map_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON user_map_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON user_map_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON user_map_data
  FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS update_user_map_data_updated_at ON user_map_data;
CREATE TRIGGER update_user_map_data_updated_at
  BEFORE UPDATE ON user_map_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Done! Make sure to enable Email Auth in:
-- Supabase Dashboard > Authentication > Providers
-- ============================================

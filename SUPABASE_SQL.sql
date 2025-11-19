-- ============================================
-- Supabase Database Setup for MyMap
-- ============================================
-- Run this SQL in your Supabase project's SQL Editor
-- ============================================

-- Step 1: Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  ip_hash TEXT,
  visited_at TIMESTAMP DEFAULT NOW(),
  page_path TEXT,
  user_agent TEXT
);

-- Step 2: Create indexes for visits table
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_visits_session ON visits(session_id);

-- Step 3: Create daily_stats table
CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  visits_count INTEGER DEFAULT 0,
  countries_marked INTEGER DEFAULT 0,
  maps_exported INTEGER DEFAULT 0,
  shares_clicked INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 4: Create index for daily_stats
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);

-- Step 5: Enable Row Level Security (RLS)
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for visits table
-- Allow anonymous users to insert visits
DROP POLICY IF EXISTS "Allow anonymous insert on visits" ON visits;
CREATE POLICY "Allow anonymous insert on visits"
  ON visits FOR INSERT
  TO anon
  WITH CHECK (true);

-- Step 7: Create RLS policies for daily_stats table
-- Allow anonymous users to read daily_stats
DROP POLICY IF EXISTS "Allow anonymous read on daily_stats" ON daily_stats;
CREATE POLICY "Allow anonymous read on daily_stats"
  ON daily_stats FOR SELECT
  TO anon
  USING (true);

-- Step 8: Optional - Create a view for today's stats
CREATE OR REPLACE VIEW today_stats AS
SELECT 
  date,
  visits_count,
  countries_marked,
  maps_exported,
  shares_clicked,
  updated_at
FROM daily_stats
WHERE date = CURRENT_DATE;

-- ============================================
-- Done! Your database is now set up.
-- ============================================
-- Next steps:
-- 1. Get your Supabase credentials (URL, anon key, service role key)
-- 2. Add them to .env.local and Railway environment variables
-- 3. See SUPABASE_SETUP.md for detailed instructions
-- ============================================


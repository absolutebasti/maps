# Supabase Setup Guide

## Step 1: Create Database Tables

Go to your Supabase project dashboard → SQL Editor and run the following SQL:

```sql
-- Create visits table
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  ip_hash TEXT,
  visited_at TIMESTAMP DEFAULT NOW(),
  page_path TEXT,
  user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_visits_date ON visits(visited_at);
CREATE INDEX idx_visits_session ON visits(session_id);

-- Create daily_stats table
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  visits_count INTEGER DEFAULT 0,
  countries_marked INTEGER DEFAULT 0,
  maps_exported INTEGER DEFAULT 0,
  shares_clicked INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for daily_stats
CREATE INDEX idx_daily_stats_date ON daily_stats(date);
```

## Step 2: Set Up Row Level Security (RLS)

Run this SQL to enable RLS and set permissions:

```sql
-- Enable RLS on visits table
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert visits (for tracking)
CREATE POLICY "Allow anonymous insert on visits"
  ON visits FOR INSERT
  TO anon
  WITH CHECK (true);

-- Enable RLS on daily_stats table
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read daily_stats (for public stats display)
CREATE POLICY "Allow anonymous read on daily_stats"
  ON daily_stats FOR SELECT
  TO anon
  USING (true);

-- Allow service role to do everything (for API routes)
-- This is handled automatically by using service role key in API routes
```

## Step 3: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on **Settings** → **API**
3. Copy the following:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 4: Add Environment Variables

### Local Development (.env.local)

**How to add to `.env.local`:**

1. Open your `.env.local` file in your code editor (it should already exist in your project root)
2. Add these three lines at the end of the file (replace with your actual values):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important notes:**
- Replace `your-project-id.supabase.co` with your actual Supabase Project URL
- Replace `your-anon-key-here` with your actual anon public key
- Replace `your-service-role-key-here` with your actual service_role key
- **Do NOT** add quotes around the values
- **Do NOT** add `NEXT_PUBLIC_` prefix to `SUPABASE_SERVICE_ROLE_KEY` (it's server-side only)
- After adding, **restart your dev server** (stop with Ctrl+C, then run `npm run dev` again)

**Example of what it should look like:**

```bash
# Your existing variables (GA4, PayPal, etc.)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PAYPAL_DONATION_LINK=https://www.paypal.com/paypalme/yourusername

# Supabase credentials (add these)
NEXT_PUBLIC_SUPABASE_URL=xxxxxxxxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxxx
```

**Note:** The example keys above are just placeholders - use your actual keys from Supabase!

### Production (Railway)

1. Go to Railway dashboard → Your project → Variables
2. Add these three variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key (keep secret!)

**Important:** The `SUPABASE_SERVICE_ROLE_KEY` should NOT be prefixed with `NEXT_PUBLIC_` because it's only used server-side in API routes.

## Step 5: Test the Setup

1. Restart your development server: `npm run dev`
2. Visit your homepage
3. Check the Supabase dashboard → Table Editor → `daily_stats` to see if a record was created
4. Check `visits` table to see if visits are being recorded

## Troubleshooting

### Stats not showing up?

1. **Check environment variables:**
   - Make sure all three Supabase variables are set
   - Restart your dev server after adding variables

2. **Check Supabase logs:**
   - Go to Supabase dashboard → Logs
   - Look for any errors

3. **Check browser console:**
   - Open DevTools → Console
   - Look for any errors related to Supabase

4. **Check API routes:**
   - Visit `/api/stats` in your browser
   - Should return JSON with stats or an error message

### RLS Policy Errors?

If you get "new row violates row-level security policy" errors:
- Make sure you ran the RLS policies SQL above
- Check that the service role key is being used in API routes (not anon key)

### Database Connection Issues?

- Verify your Supabase project URL is correct
- Check that your Supabase project is active (not paused)
- Ensure your IP is not blocked (Supabase free tier has some restrictions)

## Privacy Notes

- **IP Hashing:** IP addresses are hashed using SHA-256 before storage (one-way, cannot be reversed)
- **Session-based:** Uses browser sessionStorage to identify unique sessions
- **No Personal Data:** Only aggregate counts are stored, no user identification
- **GDPR Friendly:** Complies with privacy regulations

## Optional: View Stats in Supabase

You can create a simple view to see aggregated stats:

```sql
-- View for today's stats
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
```

Then query it: `SELECT * FROM today_stats;`


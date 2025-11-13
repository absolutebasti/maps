# 🚀 Supabase Setup Guide

This guide will help you set up Supabase for the My Visited Countries Map application.

---

## 📋 Prerequisites

- A Supabase account (free tier available)
- Your project cloned and dependencies installed

---

## 🔧 Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** and sign up/login
3. Click **"New Project"**
4. Fill in:
   - **Name**: `mymap` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free
5. Click **"Create new project"**
6. Wait ~2 minutes for setup to complete

---

## 🗄️ Step 2: Create Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy and paste the following SQL:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET timezone TO 'UTC';

-- Create countries table
CREATE TABLE public.countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  country_code TEXT NOT NULL,
  visited BOOLEAN DEFAULT false,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  visited_at DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, country_code)
);

-- Create user_settings table
CREATE TABLE public.user_settings (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  visited_country_color TEXT DEFAULT '#E8DCC4',
  theme TEXT DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for countries table
CREATE POLICY "Users can view their own countries"
  ON public.countries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own countries"
  ON public.countries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own countries"
  ON public.countries
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own countries"
  ON public.countries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for user_settings table
CREATE POLICY "Users can view their own settings"
  ON public.user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON public.user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.user_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.countries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_countries_user_id ON public.countries(user_id);
CREATE INDEX idx_countries_visited ON public.countries(visited);
CREATE INDEX idx_countries_country_code ON public.countries(country_code);
```

4. Click **"Run"** (or press `Ctrl+Enter`)
5. You should see: **"Success. No rows returned"**

---

## 🔑 Step 3: Get API Keys

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values:

   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (different long string)

---

## ⚙️ Step 4: Configure Environment Variables

1. In your project root, create `.env.local` file:

```bash
cp .env.local.example .env.local
```

2. Open `.env.local` and replace with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **IMPORTANT**: Never commit `.env.local` to git (already in `.gitignore`)

---

## 📧 Step 5: Configure Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Email** provider
3. **Enable** it (should be on by default)
4. Configure:
   - ✅ **Enable Email provider**
   - ✅ **Confirm email** (recommended for production)
   - ⚠️ For development: you can disable email confirmation

### Optional: Custom Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize:
   - Confirmation email
   - Magic link email
   - Password reset email

---

## 🌐 Step 6: Configure Site URL (for Railway deployment)

1. Go to **Project Settings** → **API**
2. Scroll to **Site URL**
3. Add your URLs:
   - **Local**: `http://localhost:3000`
   - **Production**: `https://your-app.up.railway.app` (add after deploying)

4. Scroll to **Redirect URLs**
5. Add both URLs

---

## 🧪 Step 7: Test the Setup

1. **Start your development server**:
```bash
npm run dev
```

2. **Open**: `http://localhost:3000`

3. **Test registration**:
   - Wait for the auth modal (or refresh)
   - Click "Register"
   - Enter email and password
   - Submit

4. **Check Supabase Dashboard**:
   - Go to **Authentication** → **Users**
   - You should see your new user!

5. **Test data persistence**:
   - Mark some countries as visited
   - Refresh the page
   - Countries should still be marked (loaded from Supabase)

---

## 🚀 Step 8: Deploy to Railway

1. In Railway project settings, add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

2. Redeploy your Railway app

3. Update Supabase **Site URL** with your Railway URL

---

## 🔒 Security Notes

### ✅ What's Secure:
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- API keys are environment variables (not in code)
- Passwords are hashed by Supabase (never stored plain text)

### ⚠️ Important:
- **Never** commit `.env.local` to git
- **Never** share your `service_role` key publicly
- `anon` key is safe to expose (used in browser)
- Use strong passwords for database

---

## 📊 Database Schema Overview

### `countries` table
- Stores each country a user has visited
- Links to user via `user_id`
- Includes: notes, rating, visited date

### `user_settings` table
- Stores user preferences
- One row per user
- Includes: theme, color preferences

### Row Level Security (RLS)
- Users can only read/write their own data
- Enforced at database level
- Can't be bypassed by client code

---

## 🐛 Troubleshooting

### Issue: "Invalid API key"
- ✅ Check `.env.local` has correct keys
- ✅ Restart dev server after changing `.env.local`
- ✅ Verify keys in Supabase dashboard

### Issue: "Failed to fetch"
- ✅ Check Supabase project is running (not paused)
- ✅ Check internet connection
- ✅ Verify `NEXT_PUBLIC_SUPABASE_URL` is correct

### Issue: "Row Level Security policy violation"
- ✅ Verify RLS policies were created (run SQL again)
- ✅ Check user is logged in
- ✅ Verify `user_id` matches `auth.uid()`

### Issue: "Email not confirmed"
- ✅ Check email for confirmation link
- ✅ Or disable email confirmation in Supabase settings (dev only)

---

## 📚 Helpful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

## ✅ Checklist

Before going live, ensure:

- [ ] Supabase project created
- [ ] Database schema created (SQL executed)
- [ ] Environment variables configured
- [ ] Email authentication tested
- [ ] Site URL configured
- [ ] RLS policies verified
- [ ] Data syncing works
- [ ] Railway deployment configured
- [ ] Production URL added to Supabase

---

🎉 **You're all set!** Your map data is now stored securely in the cloud with Supabase.


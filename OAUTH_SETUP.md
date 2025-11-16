# 🔐 OAuth Setup Guide (Google & Apple Sign-In)

## ✅ What's Been Implemented

Your auth system now supports:
- ✅ **Email/Password** authentication (already working)
- ✅ **Google Sign-In** (needs Supabase configuration)
- ✅ **Apple Sign-In** (needs Supabase configuration)
- ✅ All accounts stored in Supabase (not locally)
- ✅ Beautiful OAuth buttons with brand logos
- ✅ Automatic redirect handling
- ✅ Session management across devices

---

## 🚀 Setup Instructions

### **Step 1: Enable Google OAuth in Supabase**

#### 1.1 Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen (if not done):
   - User Type: **External**
   - App name: **MyMap**
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Keep defaults (email, profile, openid)
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **MyMap Production**
   - **Authorized JavaScript origins**:
     ```
     https://maps-production-d32c.up.railway.app
     https://<your-supabase-project>.supabase.co
     ```
   - **Authorized redirect URIs**:
     ```
     https://<your-supabase-project>.supabase.co/auth/v1/callback
     ```
7. Copy your **Client ID** and **Client Secret**

#### 1.2 Configure in Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list
5. Enable it and paste:
   - **Client ID**: (from step 1.1)
   - **Client Secret**: (from step 1.1)
6. Copy the **Redirect URL** shown (for reference)
7. Click **Save**

---

### **Step 2: Enable Apple Sign-In in Supabase**

#### 2.1 Create Apple Service ID
1. Go to [Apple Developer Console](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+** (to add new)
4. Select **Services IDs** → **Continue**
5. Description: **MyMap**
6. Identifier: `com.mymap.auth` (must be unique)
7. **Enable** "Sign In with Apple"
8. Click **Configure**:
   - Primary App ID: Create or select existing App ID
   - **Web Domain**: `maps-production-d32c.up.railway.app`
   - **Return URLs**:
     ```
     https://<your-supabase-project>.supabase.co/auth/v1/callback
     ```
9. Save and Continue

#### 2.2 Create Private Key
1. In Apple Developer, go to **Keys** → **+** (to add new)
2. Key Name: **MyMap Auth Key**
3. **Enable** "Sign In with Apple"
4. Click **Configure** → Select your Service ID
5. **Save** and **Download the .p8 file** (you can only download once!)
6. Note your **Key ID** (shown after creation)
7. Note your **Team ID** (top right of Apple Developer page)

#### 2.3 Configure in Supabase
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Apple** in the list
3. Enable it and enter:
   - **Service ID**: `com.mymap.auth` (from step 2.1)
   - **Team ID**: Your Apple Team ID (from step 2.2)
   - **Key ID**: Your Key ID (from step 2.2)
   - **Private Key**: Paste contents of the .p8 file
4. Click **Save**

---

### **Step 3: Update Redirect URLs** (Important!)

#### 3.1 Add Production URL
In both Google and Apple configurations, make sure you have:

**Google:**
- Authorized JavaScript origins: `https://maps-production-d32c.up.railway.app`
- Authorized redirect URIs: `https://<your-project>.supabase.co/auth/v1/callback`

**Apple:**
- Web Domain: `maps-production-d32c.up.railway.app`
- Return URLs: `https://<your-project>.supabase.co/auth/v1/callback`

#### 3.2 For Custom Domain (When You Get One)
Update both Google and Apple settings with your custom domain:
- `https://yourdomain.com`
- Add to authorized origins/domains

---

### **Step 4: Test Authentication**

1. **Deploy to Railway** (current changes)
2. **Open your app**: `https://maps-production-d32c.up.railway.app`
3. **Click "Continue with Google"**:
   - Should redirect to Google login
   - After login, should redirect back to your app
   - Should see your name in top-right corner
4. **Click "Continue with Apple"**:
   - Should redirect to Apple login
   - After login, should redirect back to your app
   - Should see your name in top-right corner

---

## 🎨 What Users Will See

### **Login Modal (New Design)**

```
┌────────────────────────────────────────┐
│        Welcome Back!                    │
│  Sign in to sync your travel map       │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  [G] Continue with Google        │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  [] Continue with Apple          │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ───────── Or continue with email ──   │
│                                         │
│  Email: ___________________________    │
│  Password: ________________________    │
│                                         │
│  [         Sign In          ]          │
│                                         │
│  Don't have an account? Register       │
└────────────────────────────────────────┘
```

---

## 🔒 Security & Privacy

### **What Data is Stored?**
- **Email**: Yes (from all providers)
- **Name**: Yes (from Google/Apple/manual entry)
- **Profile Picture**: Yes (from Google/Apple, optional)
- **Password**: Only for email/password (hashed by Supabase)
- **OAuth Tokens**: Stored securely by Supabase

### **Where is Data Stored?**
- ✅ **Supabase Auth** (user accounts)
- ✅ **Supabase Database** (travel data)
- ❌ **NOT in browser localStorage** (except session tokens)

### **Data Access**
- Users can only access their own data (Row Level Security)
- OAuth providers don't get access to travel data
- You (as admin) can see user emails for support

---

## 🐛 Troubleshooting

### **"Redirect URI mismatch" Error**
**Problem**: Google/Apple redirect URL doesn't match  
**Solution**: 
1. Check Supabase redirect URL: `https://<project>.supabase.co/auth/v1/callback`
2. Make sure it's added to Google/Apple console
3. No trailing slashes!
4. Must be exact match

### **"Invalid Service ID" (Apple)**
**Problem**: Service ID not configured properly  
**Solution**:
1. Make sure Service ID matches exactly in Apple Developer and Supabase
2. Make sure "Sign In with Apple" is enabled for the Service ID
3. Domain and Return URL must be HTTPS

### **"Access Denied" (Google)**
**Problem**: App not verified or consent screen not configured  
**Solution**:
1. Go to OAuth consent screen in Google Console
2. Add your email to test users (for testing phase)
3. For production: Submit app for verification

### **User Gets Logged Out Immediately**
**Problem**: Session cookie issue  
**Solution**:
1. Check middleware.ts has correct Supabase setup
2. Make sure cookies are allowed in browser
3. Check CORS settings in Supabase dashboard

---

## 📊 Expected User Flow

### **New User (Google)**
1. Click "Continue with Google"
2. Google login popup
3. Grant permissions (email, profile)
4. Redirected back to MyMap
5. ✅ Logged in, name shown in header
6. Data syncs to Supabase automatically

### **Returning User (Apple)**
1. Click "Continue with Apple"
2. Apple login (FaceID/TouchID/Password)
3. Redirected back to MyMap
4. ✅ Logged in, previous data loads

### **Switching Devices**
1. Login on Phone with Google
2. Mark 10 countries
3. Login on Laptop with same Google account
4. ✅ All 10 countries appear automatically

---

## ✅ Post-Setup Checklist

- [ ] Google OAuth enabled in Supabase
- [ ] Apple Sign In enabled in Supabase
- [ ] Redirect URLs match exactly
- [ ] Tested Google login on production
- [ ] Tested Apple login on production
- [ ] Tested data sync across devices
- [ ] Added test users to Google OAuth consent (if not verified)
- [ ] Updated email templates in Supabase (optional)

---

## 🚀 Benefits for Users

1. **One-Click Login**: No password to remember
2. **Trusted Providers**: Users trust Google/Apple
3. **Faster Signup**: No form filling (except email method)
4. **Multi-Device**: Automatic sync across all devices
5. **Secure**: OAuth tokens, not passwords
6. **Social Proof**: "Sign in with Google" increases trust

---

## 📈 Analytics to Track

Once enabled, monitor:
- **OAuth vs Email signups**: Which method is more popular?
- **Google vs Apple**: Which provider is preferred?
- **Completion Rate**: How many start vs complete OAuth flow?
- **Device Usage**: Mobile vs Desktop OAuth usage

---

## 🔄 Migration from localStorage

Your old localStorage authentication code is **already replaced** with Supabase. 

**Users who were using localStorage**:
- Will see login modal after 15 seconds (as before)
- Can create new account or login
- Old local data will sync to Supabase on first login

---

## 🎯 Next Steps

1. **Enable OAuth** in Supabase (steps above)
2. **Test** both Google and Apple login
3. **Monitor** which method users prefer
4. **Optimize** based on user feedback
5. **Consider** adding GitHub/Discord OAuth (easy to add)

---

## 💡 Adding More OAuth Providers (Future)

Supabase supports:
- GitHub
- GitLab
- Bitbucket
- Discord
- Facebook
- Twitter
- LinkedIn
- Slack
- Spotify

**To add**: Same process as Google/Apple - enable in Supabase dashboard!

---

**Need Help?**
- [Supabase OAuth Docs](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Docs](https://developer.apple.com/sign-in-with-apple/)


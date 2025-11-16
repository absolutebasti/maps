# 🍎 Apple Sign-In Setup Guide (Step-by-Step)

## 📋 Prerequisites

Before starting, you need:
- ✅ An **Apple Developer Account** ($99/year)
- ✅ Access to [Apple Developer Console](https://developer.apple.com/account)
- ✅ Your **Supabase Project URL** (e.g., `https://abcdefg.supabase.co`)
- ✅ Your app's production URL (e.g., `https://maps-production-d32c.up.railway.app`)

**Don't have an Apple Developer Account?**
- Sign up at: https://developer.apple.com/programs/enroll/
- Cost: $99/year
- Approval time: Usually 24-48 hours

---

## 🎯 Overview

You'll need to create **3 things**:
1. **App ID** (identifies your app)
2. **Services ID** (for web authentication)
3. **Private Key** (for secure communication)

Then configure these in **Supabase**.

**Total Time:** 20-30 minutes

---

## 📝 Step 1: Create an App ID

### 1.1 Navigate to Identifiers
1. Go to [Apple Developer Console](https://developer.apple.com/account)
2. Click **Certificates, Identifiers & Profiles** (left sidebar)
3. Click **Identifiers** (left sidebar)
4. Click the **[+]** button (top left, next to "Identifiers")

### 1.2 Select App IDs
1. Select **App IDs** (should be selected by default)
2. Click **Continue**

### 1.3 Select Type
1. Select **App** (not App Clip)
2. Click **Continue**

### 1.4 Register App ID
Fill in the form:

**Description:**
```
MyMap Travel Tracker
```

**Bundle ID:**
- Select: **Explicit**
- Bundle ID: `com.mymap.travelapp` (or your own unique identifier)
  
  **⚠️ Important:** 
  - Must be unique (reverse domain format)
  - Cannot be changed later
  - Example: `com.yourname.mymap`

**Capabilities:**
1. Scroll down to find **Sign In with Apple**
2. **Check the box** to enable it
3. Click **Continue**
4. Review and click **Register**

**✅ Done!** You now have an App ID.

---

## 📝 Step 2: Create a Services ID (For Web)

### 2.1 Navigate to Identifiers Again
1. Go back to **Identifiers** (left sidebar)
2. Click the **[+]** button again

### 2.2 Select Services IDs
1. Select **Services IDs** (not App IDs this time)
2. Click **Continue**

### 2.3 Register Services ID
Fill in the form:

**Description:**
```
MyMap Web Authentication
```

**Identifier:**
```
com.mymap.auth.web
```

**⚠️ Important:**
- Must be different from your App ID
- Common format: `com.yourapp.auth` or `com.yourapp.signin`
- Cannot be changed later
- Write this down - you'll need it for Supabase!

**Enable Sign In with Apple:**
1. **Check the box** next to "Sign In with Apple"
2. Click **Configure** (right next to the checkbox)

### 2.4 Configure Web Authentication

A popup will appear. Fill it in:

**Primary App ID:**
- Select your App ID from Step 1: `MyMap Travel Tracker`

**Web Domain:**
```
maps-production-d32c.up.railway.app
```

**⚠️ Important:**
- **NO** `https://` prefix
- **NO** trailing slash `/`
- Just the domain name
- If you have a custom domain, use that instead

**Return URLs:**

You need your **Supabase Project URL** for this. Find it:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** (looks like `https://abcdefgh.supabase.co`)

Then add this Return URL:
```
https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
```

**Example:**
```
https://abcdefgh.supabase.co/auth/v1/callback
```

**⚠️ Important:**
- Must be **exact match** (including `/auth/v1/callback`)
- Must use **HTTPS**
- No trailing slash
- Copy-paste to avoid typos

Click **Next** → **Done** → **Continue** → **Register**

**✅ Done!** You now have a Services ID configured.

---

## 📝 Step 3: Create a Private Key

### 3.1 Navigate to Keys
1. In Apple Developer Console, click **Keys** (left sidebar)
2. Click the **[+]** button (top left)

### 3.2 Register a New Key

**Key Name:**
```
MyMap Sign In with Apple Key
```

**Enable Sign In with Apple:**
1. Check the box next to **Sign In with Apple**
2. Click **Configure** (right next to the checkbox)

### 3.3 Configure the Key

A popup appears:

**Primary App ID:**
- Select: `MyMap Travel Tracker` (from Step 1)

Click **Save** → **Continue** → **Register**

### 3.4 Download the Key

**⚠️ CRITICAL - READ CAREFULLY:**

After clicking Register, you'll see:

1. **Key ID** - A 10-character code (e.g., `AB12CD34EF`)
   - **COPY THIS** and save it in a text file
   
2. **Download** button
   - Click it to download a `.p8` file (e.g., `AuthKey_AB12CD34EF.p8`)
   - **Save this file** - you can only download it ONCE
   - If you lose it, you'll have to create a new key

3. **Warning message**: "This is the only time you can download this key."
   - This is not a joke - **download it now!**

Click **Done**

**✅ Done!** You now have all required Apple components.

---

## 📝 Step 4: Find Your Team ID

You need your **Team ID** for Supabase configuration.

### How to Find It:

**Method 1: Top of Developer Page**
1. In Apple Developer Console
2. Look at the **top-right corner** of the page
3. You'll see your name/organization
4. Below it is your **Team ID** (10 characters, e.g., `X9Y8Z7W6V5`)

**Method 2: Membership Page**
1. Go to **Membership** (left sidebar under "Program Resources")
2. Your **Team ID** is shown clearly
3. Copy it

**✅ Write down your Team ID!**

---

## 📝 Step 5: Prepare Key File Contents

You need to get the **contents** of the `.p8` file you downloaded.

### 5.1 Open the .p8 File

**On Mac:**
1. Find the file in your Downloads folder (e.g., `AuthKey_AB12CD34EF.p8`)
2. Right-click → **Open With** → **TextEdit**

**On Windows:**
1. Find the file in your Downloads folder
2. Right-click → **Open with** → **Notepad**

**On Linux:**
1. Open terminal
2. Run: `cat ~/Downloads/AuthKey_*.p8`

### 5.2 Copy the Contents

You'll see something like:
```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgabcdefghijklmnop
qrstuvwxyz1234567890ABCDEFGHIJK=
-----END PRIVATE KEY-----
```

**Copy EVERYTHING** including:
- `-----BEGIN PRIVATE KEY-----`
- All the random characters in the middle
- `-----END PRIVATE KEY-----`

---

## 📝 Step 6: Configure in Supabase

Now you have everything you need:
- ✅ Services ID (from Step 2)
- ✅ Team ID (from Step 4)
- ✅ Key ID (from Step 3)
- ✅ Private Key contents (from Step 5)

### 6.1 Go to Supabase Authentication Settings

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Authentication** (left sidebar)
4. Click **Providers** (top tabs)
5. Scroll down to find **Apple**

### 6.2 Enable and Configure Apple

**Enable Apple Provider:**
- Toggle the switch to **ON** (should turn green)

**Fill in the form:**

**Services ID:**
```
com.mymap.auth.web
```
(This is your Services ID from Step 2.3 - must match exactly!)

**Team ID:**
```
X9Y8Z7W6V5
```
(Your 10-character Team ID from Step 4)

**Key ID:**
```
AB12CD34EF
```
(Your 10-character Key ID from Step 3.4)

**Private Key:**
Paste the entire contents of your .p8 file:
```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgabcdefghijklmnop
qrstuvwxyz1234567890ABCDEFGHIJK=
-----END PRIVATE KEY-----
```

**⚠️ Important:**
- Paste the ENTIRE key including BEGIN/END lines
- No extra spaces before or after
- All in one block

### 6.3 Save

Click the **Save** button at the bottom.

If you see an error, double-check:
- All IDs match exactly (no typos)
- Private key is complete
- No extra spaces or newlines

**✅ Done!** Apple Sign-In is now enabled in Supabase!

---

## 🧪 Step 7: Test It!

### 7.1 Deploy Your App

Make sure your latest code is deployed to Railway/production.

### 7.2 Test Apple Sign-In

1. Go to your app: `https://maps-production-d32c.up.railway.app`
2. Wait 15 seconds for the auth modal to appear (or trigger it manually)
3. Click **"Continue with Apple"** button
4. You should be redirected to Apple's login page

### 7.3 Expected Flow

**On Desktop:**
1. Apple login page appears
2. Enter your Apple ID email and password
3. (Optional) Two-factor authentication
4. Choose whether to share or hide your email
5. Redirected back to your app
6. ✅ You're logged in!

**On iPhone/iPad:**
1. Apple sign-in popup appears
2. Use Face ID / Touch ID / passcode
3. Choose whether to share or hide your email
4. ✅ You're logged in!

---

## ❌ Troubleshooting Common Errors

### Error: "invalid_request"

**Cause:** Services ID or Return URL mismatch

**Fix:**
1. Go back to Apple Developer Console
2. Go to **Identifiers** → Your Services ID
3. Click on it → **Configure** Sign In with Apple
4. Verify:
   - Domain: `maps-production-d32c.up.railway.app` (no https://)
   - Return URL: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
5. Must match EXACTLY (including `/auth/v1/callback`)

---

### Error: "invalid_client"

**Cause:** Services ID in Supabase doesn't match Apple

**Fix:**
1. Go to Supabase → Authentication → Providers → Apple
2. Check **Services ID** field
3. Go to Apple Developer → Identifiers → Services ID
4. Copy the **Identifier** exactly
5. Paste into Supabase (must match character-for-character)

---

### Error: "unauthorized_client"

**Cause:** Domain not authorized in Apple

**Fix:**
1. Go to Apple Developer Console
2. Identifiers → Your Services ID
3. Edit → Configure Sign In with Apple
4. Check **Web Domain** is correct (no https://, no trailing slash)
5. Example: `maps-production-d32c.up.railway.app`
6. Save and wait 5 minutes for changes to propagate

---

### Error: "Unable to verify key"

**Cause:** Private Key is incorrect or malformed

**Fix:**
1. Open your `.p8` file again in a text editor
2. Copy EVERYTHING including:
   - `-----BEGIN PRIVATE KEY-----`
   - All middle content
   - `-----END PRIVATE KEY-----`
3. No extra spaces or newlines before/after
4. Paste into Supabase again
5. Save

If still doesn't work:
1. Go to Apple Developer → Keys
2. **Revoke** the old key
3. Create a new key (repeat Step 3)
4. Download new `.p8` file
5. Update Supabase with new Key ID and Private Key

---

### Error: "invalid_grant"

**Cause:** Team ID or Key ID is incorrect

**Fix:**
1. Verify **Team ID**:
   - Apple Developer Console → Membership
   - Copy the Team ID shown
   - Paste into Supabase (10 characters)

2. Verify **Key ID**:
   - Apple Developer Console → Keys
   - Click on your key
   - Copy the Key ID shown (10 characters)
   - Paste into Supabase

---

### Error: "redirect_uri_mismatch"

**Cause:** Return URL doesn't match

**Fix:**
1. Get your Supabase Project URL:
   - Supabase Dashboard → Settings → API
   - Copy **Project URL** (e.g., `https://abc123.supabase.co`)

2. Add to Apple:
   - Apple Developer → Identifiers → Services ID → Configure
   - Return URLs: `https://abc123.supabase.co/auth/v1/callback`
   - **Must include** `/auth/v1/callback` at the end
   - Save and wait 5 minutes

---

### Sign-In Works But User Not Created

**Cause:** Callback route issue

**Fix:**
1. Check your app has the file: `app/auth/callback/route.ts`
2. Should contain:
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/`)
}
```
3. Redeploy if needed

---

## 📋 Quick Reference Checklist

### Information to Gather:

- [ ] **App ID**: Created in Step 1
- [ ] **Services ID**: `com.mymap.auth.web` (your actual ID)
- [ ] **Team ID**: 10 characters (e.g., `X9Y8Z7W6V5`)
- [ ] **Key ID**: 10 characters (e.g., `AB12CD34EF`)
- [ ] **Private Key (.p8)**: Downloaded and saved
- [ ] **Supabase Project URL**: `https://YOUR-PROJECT.supabase.co`
- [ ] **Production URL**: `https://maps-production-d32c.up.railway.app`

### Apple Developer Console Setup:

- [ ] Created App ID with Sign In with Apple enabled
- [ ] Created Services ID
- [ ] Configured Services ID with:
  - [ ] Web Domain (no https://)
  - [ ] Return URL (Supabase callback)
- [ ] Created Private Key
- [ ] Downloaded .p8 file
- [ ] Saved Key ID

### Supabase Configuration:

- [ ] Enabled Apple provider
- [ ] Entered Services ID
- [ ] Entered Team ID
- [ ] Entered Key ID
- [ ] Pasted Private Key contents
- [ ] Clicked Save

### Testing:

- [ ] Deployed latest code
- [ ] Clicked "Continue with Apple"
- [ ] Redirected to Apple login
- [ ] Successfully logged in
- [ ] Redirected back to app
- [ ] Name appears in header

---

## 💡 Pro Tips

1. **Save Everything**: Keep your Services ID, Team ID, Key ID, and .p8 file in a secure password manager

2. **Test on Multiple Devices**: Apple Sign-In works differently on iOS vs Web

3. **Email Privacy**: Users can choose "Hide My Email" - Apple will generate a relay email

4. **Production Only**: Apple Sign-In doesn't work well on localhost - use your production URL

5. **Wait After Changes**: When you update settings in Apple Developer Console, wait 5-10 minutes for changes to propagate

6. **Use Safari for Testing**: Apple Sign-In works best in Safari browser for initial testing

---

## 🎓 Understanding the Components

**App ID** = Identifies your app to Apple  
**Services ID** = Allows web authentication (not just iOS apps)  
**Private Key** = Secure communication between Supabase and Apple  
**Team ID** = Identifies your Apple Developer account  
**Key ID** = Identifies which key to use (you can have multiple)  

Think of it like:
- **App ID** = Your app's passport
- **Services ID** = Your app's visa for the web
- **Private Key** = Secret handshake with Apple
- **Team ID** = Your developer membership card
- **Key ID** = Which secret handshake to use

---

## 📞 Need More Help?

- **Apple Developer Support**: https://developer.apple.com/support/
- **Supabase Docs**: https://supabase.com/docs/guides/auth/social-login/auth-apple
- **Apple Sign In Docs**: https://developer.apple.com/sign-in-with-apple/

---

**Total Time:** 20-30 minutes  
**Difficulty:** Medium  
**Cost:** $99/year (Apple Developer Account)

**You've got this! 🚀**


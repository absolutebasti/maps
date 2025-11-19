# Setup Guide

## Environment Variables

### Google Analytics 4 (GA4)

To enable analytics tracking, you need to set up Google Analytics:

1. **Create a Google Analytics 4 property:**
   - Go to: https://analytics.google.com
   - Create a new GA4 property (or use existing)
   - Get your Measurement ID (format: `G-XXXXXXXXXX`)

2. **Add to `.env.local` file:**
   ```
   NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **For production (Railway/Vercel):**
   - Add the same environment variable in your hosting platform
   - The analytics will automatically start tracking once deployed

**Note:** Analytics only works when the `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is set. In development, events are logged to the console for debugging.

### PayPal Donation Link

To enable the donation feature, you need to set up your PayPal donation link:

1. Create a `.env.local` file in the root directory:
   ```bash
   touch .env.local
   ```

2. Add your PayPal donation link:
   ```
   NEXT_PUBLIC_PAYPAL_DONATION_LINK=https://www.paypal.com/paypalme/yourusername
   ```

   Or use a full PayPal donation link:
   ```
   NEXT_PUBLIC_PAYPAL_DONATION_LINK=https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID
   ```

3. Restart your development server for changes to take effect.

**Note:** The `.env.local` file is gitignored and will not be committed to the repository, keeping your PayPal link secure.

## Production Deployment

When deploying to production (e.g., Railway, Vercel), add the environment variable in your hosting platform's settings:

### Railway

1. Go to your Railway dashboard: https://railway.app
2. Select your MyMap project
3. Click on your service (the app you deployed)
4. Go to the **Variables** tab (or **Settings** → **Variables**)
5. Click **+ New Variable** for each variable:

   **Google Analytics:**
   - **Name**: `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (your GA4 Measurement ID)

   **PayPal Donation:**
   - **Name**: `NEXT_PUBLIC_PAYPAL_DONATION_LINK`
   - **Value**: `https://www.paypal.com/paypalme/yourusername` (replace with your actual PayPal link)

6. Click **Add** or **Save** for each variable
7. Railway will automatically redeploy your app with the new environment variables

**Note**: After adding variables, wait for Railway to finish redeploying (you'll see the deployment status in the dashboard). Features will work once the deployment completes.

### Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New** for each variable:

   **Google Analytics:**
   - **Key**: `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (your GA4 Measurement ID)
   - **Environment**: Select all (Production, Preview, Development)

   **PayPal Donation:**
   - **Key**: `NEXT_PUBLIC_PAYPAL_DONATION_LINK`
   - **Value**: `https://www.paypal.com/paypalme/yourusername`
   - **Environment**: Select all (Production, Preview, Development)

5. Click **Save** for each variable
6. Redeploy your application


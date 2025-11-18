# Setup Guide

## Environment Variables

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
5. Click **+ New Variable**
6. Add:
   - **Name**: `NEXT_PUBLIC_PAYPAL_DONATION_LINK`
   - **Value**: `https://www.paypal.com/paypalme/yourusername` (replace with your actual PayPal link)
7. Click **Add** or **Save**
8. Railway will automatically redeploy your app with the new environment variable

**Note**: After adding the variable, wait for Railway to finish redeploying (you'll see the deployment status in the dashboard). The PayPal donation feature will work once the deployment completes.

### Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Key**: `NEXT_PUBLIC_PAYPAL_DONATION_LINK`
   - **Value**: `https://www.paypal.com/paypalme/yourusername`
   - **Environment**: Select all (Production, Preview, Development)
6. Click **Save**
7. Redeploy your application


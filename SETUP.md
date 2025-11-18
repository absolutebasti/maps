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

- **Railway**: Project Settings → Variables → Add `NEXT_PUBLIC_PAYPAL_DONATION_LINK`
- **Vercel**: Project Settings → Environment Variables → Add `NEXT_PUBLIC_PAYPAL_DONATION_LINK`


import "./../styles/globals.css";
import type { ReactNode } from "react";
import { StorePersistence } from "./../components/StorePersistence";
import { ToastProvider } from "./../components/ui/toast";
import { lemonMilk } from "./fonts";
import { GoogleAnalytics } from "@next/third-parties/google";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maps-production-d32c.up.railway.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Create Your Visited Countries Map - Track Your Travel Journey | MyMap",
  description: "Free interactive world map to track and visualize countries you've visited. Mark visited countries, add notes, rate your trips, and create a beautiful travel map. Perfect for tracking your travel bucket list and sharing your adventures.",
  keywords: [
    "visited countries map",
    "create travel map",
    "countries I've been to",
    "track visited countries",
    "interactive world map",
    "travel tracker",
    "scratch map online",
    "visited countries tracker",
    "travel map maker",
    "world travel map",
    "countries visited list",
    "travel journal map",
    "bucket list countries",
    "mark countries visited",
    "travel visualization"
  ],
  authors: [{ name: "MyMap" }],
  creator: "MyMap",
  publisher: "MyMap",
  openGraph: {
    title: "Create Your Visited Countries Map - Track Your Travel Journey",
    description: "Free interactive world map to track countries you've visited. Mark visited countries, add notes, and visualize your travel adventures.",
    url: siteUrl,
    siteName: "MyMap - Visited Countries Tracker",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MyMap - Create Your Visited Countries Map"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Your Visited Countries Map - Track Your Travel Journey",
    description: "Free interactive world map to track countries you've visited. Mark visited countries, add notes, and visualize your travel adventures.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these when you set them up:
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

  return (
    <html lang="en" suppressHydrationWarning className={lemonMilk.variable}>
      <head>
        <link rel="canonical" href={siteUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#A8D8EA" />
      </head>
      <body>
        <ToastProvider>
          <StorePersistence />
          {children}
        </ToastProvider>
        {ga4Id && <GoogleAnalytics gaId={ga4Id} />}
      </body>
    </html>
  );
}



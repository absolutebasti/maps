import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DonationHint } from "@/components/DonationHint";
import { SocialProof } from "@/components/SocialProof";

export const metadata: Metadata = {
  title: "Features - Track Visited Countries with MyMap | MyMap",
  description: "Discover all the features of MyMap: interactive world map, country tracking, notes, ratings, tags, high-quality exports, and more. Free travel map tracker.",
  openGraph: {
    title: "Features - Track Visited Countries with MyMap",
    description: "Discover all the features of MyMap: interactive world map, country tracking, and more.",
  },
};

const features = [
  {
    title: "Interactive World Map",
    description: "Click on any of the 195 countries to view details, mark as visited, and explore. The map automatically zooms to selected countries and provides smooth navigation with zoom and pan controls.",
    icon: "🗺️",
    keywords: ["interactive map", "world map", "country map"],
  },
  {
    title: "Track All 195 Countries",
    description: "Track every UN member country and territory. Search by name, filter by visited status, and manage your entire travel history in one place.",
    icon: "🌍",
    keywords: ["country tracking", "visited countries", "travel tracker"],
  },
  {
    title: "Rich Country Details",
    description: "Add personal notes, visit dates, and 1-5 star ratings for each country. Document your memories, favorite cities, and travel experiences.",
    icon: "📝",
    keywords: ["travel notes", "travel journal", "country details"],
  },
  {
    title: "Smart Tagging System",
    description: "Organize countries with custom tags like 'Want to Visit', 'Lived Here', or 'Favorite'. Create your own tags with colors and emojis for better organization.",
    icon: "🏷️",
    keywords: ["travel tags", "country tags", "organize travels"],
  },
  {
    title: "High-Quality Exports",
    description: "Export your map as a PNG image in various resolutions: Print Quality (3840x2560), Social Media (1200x630), HD (1920x1080), or 4K (3840x2160). Perfect for printing or sharing.",
    icon: "📤",
    keywords: ["export map", "travel map export", "PNG export"],
  },
  {
    title: "Share Your Map",
    description: "Share your travel map directly using the Web Share API or copy to clipboard. Show off your adventures to friends and family with one click.",
    icon: "📱",
    keywords: ["share map", "travel sharing", "social sharing"],
  },
  {
    title: "Mobile Optimized",
    description: "Fully responsive design that works beautifully on phones, tablets, and desktops. Touch-friendly controls, mobile drawer, and adaptive UI for the best experience on any device.",
    icon: "📱",
    keywords: ["mobile travel tracker", "responsive design", "mobile app"],
  },
  {
    title: "Privacy First",
    description: "All your data is stored locally in your browser. No accounts, no servers, no data collection. Your travel data stays private and secure on your device.",
    icon: "🔒",
    keywords: ["privacy", "local storage", "secure travel tracker"],
  },
  {
    title: "Free Forever",
    description: "MyMap is completely free to use with no hidden costs, subscriptions, or premium features. All features are available to everyone, always.",
    icon: "🆓",
    keywords: ["free travel tracker", "no cost", "free map tool"],
  },
  {
    title: "Search & Filter",
    description: "Quickly find any country with the searchable dropdown. Filter by visited/not visited status, and manage multiple countries at once from the dedicated management page.",
    icon: "🔍",
    keywords: ["country search", "filter countries", "travel search"],
  },
  {
    title: "Statistics & Progress",
    description: "Track your progress with real-time statistics showing visited count, percentage, and visual progress indicators. See how many countries you've explored.",
    icon: "📊",
    keywords: ["travel statistics", "progress tracker", "travel percentage"],
  },
  {
    title: "Keyboard Shortcuts",
    description: "Navigate efficiently with keyboard shortcuts. Press Ctrl/Cmd + ? to view all available shortcuts and speed up your workflow.",
    icon: "⌨️",
    keywords: ["keyboard shortcuts", "productivity", "quick navigation"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-lemon-milk)" }}>
              Features
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to track, visualize, and share your travel journey around the world
            </p>
            <div className="flex items-center justify-center pt-2">
              <SocialProof />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="space-y-3 p-6 rounded-lg border bg-card hover:border-primary/50 transition-colors"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h2 className="text-xl font-semibold">{feature.title}</h2>
                <p className="text-muted-foreground">{feature.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {feature.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Use Cases Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Perfect For</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 rounded-lg border bg-card text-center space-y-2">
                <div className="text-3xl mb-2">🎒</div>
                <h3 className="font-semibold">Backpackers</h3>
                <p className="text-sm text-muted-foreground">
                  Track your gap year adventures and long-term travels
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card text-center space-y-2">
                <div className="text-3xl mb-2">💻</div>
                <h3 className="font-semibold">Digital Nomads</h3>
                <p className="text-sm text-muted-foreground">
                  Document your remote work journey around the world
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card text-center space-y-2">
                <div className="text-3xl mb-2">✈️</div>
                <h3 className="font-semibold">Travel Enthusiasts</h3>
                <p className="text-sm text-muted-foreground">
                  Keep track of your vacation destinations and bucket list
                </p>
              </div>
            </div>
          </section>

          {/* Donation Hint */}
          <DonationHint variant="compact" />

          {/* CTA Section */}
          <section className="text-center space-y-6 p-8 rounded-lg border bg-muted/50">
            <h2 className="text-2xl font-bold">Ready to Start Tracking?</h2>
            <p className="text-muted-foreground">
              All features are free and available right now. No sign-up required.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Start Tracking Free
              </Link>
              <Link
                href="/about"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Learn More
              </Link>
            </div>
          </section>

          {/* Footer Links */}
          <nav className="flex flex-wrap gap-2 sm:gap-6 justify-center">
            <Link 
              href="/" 
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              About
            </Link>
            <Link 
              href="/faq" 
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              FAQ
            </Link>
            <Link 
              href="/blog" 
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Blog
            </Link>
          </nav>
        </div>
      </main>
    </div>
  );
}


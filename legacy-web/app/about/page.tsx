import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DonationHint } from "@/components/DonationHint";
import { SocialProof } from "@/components/SocialProof";

export const metadata: Metadata = {
  title: "About MyMap - Your Travel Journey Tracker | MyMap",
  description: "Learn about MyMap, a free tool to track and visualize countries you've visited. Discover our mission to help travelers document their adventures around the world.",
  openGraph: {
    title: "About MyMap - Your Travel Journey Tracker",
    description: "Learn about MyMap, a free tool to track and visualize countries you've visited.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Back to Map Button */}
          <div className="flex justify-start">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2 touch-manipulation min-h-[44px]")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Map
            </Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-lemon-milk)" }}>
              About MyMap
            </h1>
            <p className="text-xl text-muted-foreground">
              Helping travelers document and visualize their journey around the world
            </p>
            <div className="flex items-center justify-center pt-2">
              <SocialProof />
            </div>
          </div>

          {/* Mission Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Our Mission 🎯</h2>
            <div className="space-y-3 text-base leading-7">
              <p>
                MyMap was created with a simple goal: <strong>to help travelers easily track and visualize 
                the countries they've visited</strong>. We believe that every journey deserves to be remembered, 
                and every adventure should be celebrated.
              </p>
              <p>
                Whether you're a <strong>digital nomad</strong>, a <strong>backpacker</strong>, or 
                someone who loves to travel during vacations, MyMap provides a beautiful and intuitive 
                way to document your global adventures.
              </p>
            </div>
          </section>

          {/* Story Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Our Story 📖</h2>
            <div className="space-y-4 text-base leading-7">
              <p>
                The idea for MyMap came from a simple frustration: existing travel tracking tools 
                were either too complicated, required accounts, or didn't provide the visual experience 
                we wanted.
              </p>
              <p className="font-medium">We wanted something that was:</p>
              <ul className="space-y-2 ml-6 list-disc">
                <li><strong>Free and accessible</strong> - No sign-ups, no subscriptions, no barriers</li>
                <li><strong>Privacy-focused</strong> - Your data stays on your device</li>
                <li><strong>Beautiful and intuitive</strong> - A joy to use, not a chore</li>
                <li><strong>Feature-rich</strong> - Notes, ratings, tags, and high-quality exports</li>
              </ul>
              <p>
                So we built MyMap to be exactly that: a <strong>free, privacy-first tool</strong> that helps you 
                create a beautiful visual record of your travels without any hassle.
              </p>
            </div>
          </section>

          {/* Values Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Our Values 💎</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 p-6 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  🔒 Privacy First
                </h3>
                <p className="text-muted-foreground text-sm leading-6">
                  All your data is stored locally in your browser. We don't collect, store, or 
                  share any of your personal information. <strong>Your travel data belongs to you.</strong>
                </p>
              </div>
              <div className="space-y-2 p-6 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  🆓 Free Forever
                </h3>
                <p className="text-muted-foreground text-sm leading-6">
                  MyMap is completely free to use, with no hidden costs, subscriptions, or 
                  premium features. <strong>Travel tracking should be accessible to everyone.</strong>
                </p>
              </div>
              <div className="space-y-2 p-6 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  ✨ User Experience
                </h3>
                <p className="text-muted-foreground text-sm leading-6">
                  We're committed to creating the best possible experience. Every feature is 
                  designed with <strong>usability and beauty in mind</strong>, from mobile to desktop.
                </p>
              </div>
              <div className="space-y-2 p-6 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  🚀 Continuous Improvement
                </h3>
                <p className="text-muted-foreground text-sm leading-6">
                  We're always working to improve MyMap based on user feedback. 
                  <strong> Your suggestions help shape the future</strong> of the tool.
                </p>
              </div>
            </div>
          </section>

          {/* Features Highlight */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">What Makes MyMap Special ⭐</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card/50">
                <span className="text-2xl">🌍</span>
                <div>
                  <h3 className="font-semibold mb-1">195 Countries</h3>
                  <p className="text-sm text-muted-foreground">Track all UN member countries and territories</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card/50">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h3 className="font-semibold mb-1">Interactive Map</h3>
                  <p className="text-sm text-muted-foreground">Beautiful, clickable world map with zoom and pan</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card/50">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="font-semibold mb-1">Rich Details</h3>
                  <p className="text-sm text-muted-foreground">Add notes, visit dates, and ratings for each country</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card/50">
                <span className="text-2xl">🏷️</span>
                <div>
                  <h3 className="font-semibold mb-1">Smart Tags</h3>
                  <p className="text-sm text-muted-foreground">Organize countries with custom tags like "Want to Visit"</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card/50">
                <span className="text-2xl">📤</span>
                <div>
                  <h3 className="font-semibold mb-1">High-Quality Exports</h3>
                  <p className="text-sm text-muted-foreground">Export your map as PNG in various resolutions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card/50">
                <span className="text-2xl">📱</span>
                <div>
                  <h3 className="font-semibold mb-1">Mobile Optimized</h3>
                  <p className="text-sm text-muted-foreground">Works beautifully on phones, tablets, and desktops</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card/50 sm:col-span-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-semibold mb-1">No Account Required</h3>
                  <p className="text-sm text-muted-foreground">Start tracking immediately, no sign-up needed</p>
                </div>
              </div>
            </div>
          </section>

          {/* Donation Hint */}
          <DonationHint variant="default" />

          {/* CTA Section */}
          <section className="text-center space-y-6 p-8 rounded-lg border bg-muted/50">
            <h2 className="text-2xl font-bold">Ready to Start Tracking Your Journey?</h2>
            <p className="text-muted-foreground">
              Join thousands of travelers documenting their adventures around the world
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Start Tracking Free
              </Link>
              <Link
                href="/features"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                View Features
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
              href="/features" 
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Features
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


import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DonationHint } from "@/components/DonationHint";

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
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
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
          </div>

          {/* Mission Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                MyMap was created with a simple goal: to help travelers easily track and visualize 
                the countries they've visited. We believe that every journey deserves to be remembered, 
                and every adventure should be celebrated.
              </p>
              <p>
                Whether you're a digital nomad exploring the world, a backpacker on a gap year, or 
                someone who loves to travel during vacations, MyMap provides a beautiful and intuitive 
                way to document your global adventures.
              </p>
            </div>
          </section>

          {/* Story Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                The idea for MyMap came from a simple frustration: existing travel tracking tools 
                were either too complicated, required accounts, or didn't provide the visual experience 
                we wanted. We wanted something that was:
              </p>
              <ul>
                <li><strong>Free and accessible</strong> - No sign-ups, no subscriptions, no barriers</li>
                <li><strong>Privacy-focused</strong> - Your data stays on your device</li>
                <li><strong>Beautiful and intuitive</strong> - A joy to use, not a chore</li>
                <li><strong>Feature-rich</strong> - Notes, ratings, tags, and high-quality exports</li>
              </ul>
              <p>
                So we built MyMap to be exactly that: a free, privacy-first tool that helps you 
                create a beautiful visual record of your travels without any hassle.
              </p>
            </div>
          </section>

          {/* Values Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Our Values</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold">Privacy First</h3>
                <p className="text-muted-foreground">
                  All your data is stored locally in your browser. We don't collect, store, or 
                  share any of your personal information. Your travel data belongs to you.
                </p>
              </div>
              <div className="space-y-2 p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold">Free Forever</h3>
                <p className="text-muted-foreground">
                  MyMap is completely free to use, with no hidden costs, subscriptions, or 
                  premium features. We believe travel tracking should be accessible to everyone.
                </p>
              </div>
              <div className="space-y-2 p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold">User Experience</h3>
                <p className="text-muted-foreground">
                  We're committed to creating the best possible experience. Every feature is 
                  designed with usability and beauty in mind, from mobile to desktop.
                </p>
              </div>
              <div className="space-y-2 p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold">Continuous Improvement</h3>
                <p className="text-muted-foreground">
                  We're always working to improve MyMap based on user feedback. Your suggestions 
                  help shape the future of the tool.
                </p>
              </div>
            </div>
          </section>

          {/* Features Highlight */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">What Makes MyMap Special</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ul>
                <li><strong>195 Countries</strong> - Track all UN member countries and territories</li>
                <li><strong>Interactive Map</strong> - Beautiful, clickable world map with zoom and pan</li>
                <li><strong>Rich Details</strong> - Add notes, visit dates, and ratings for each country</li>
                <li><strong>Smart Tags</strong> - Organize countries with custom tags like "Want to Visit" or "Lived Here"</li>
                <li><strong>High-Quality Exports</strong> - Export your map as PNG in various resolutions</li>
                <li><strong>Mobile Optimized</strong> - Works beautifully on phones, tablets, and desktops</li>
                <li><strong>No Account Required</strong> - Start tracking immediately, no sign-up needed</li>
              </ul>
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
          <nav className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/features" className="hover:text-foreground">Features</Link>
            <Link href="/faq" className="hover:text-foreground">FAQ</Link>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
          </nav>
        </div>
      </main>
    </div>
  );
}


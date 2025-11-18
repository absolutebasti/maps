import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | MyMap",
  description: "Find answers to common questions about MyMap, the free visited countries tracker. Learn how to use features, track countries, export maps, and more.",
  openGraph: {
    title: "FAQ - Frequently Asked Questions | MyMap",
    description: "Find answers to common questions about MyMap, the free visited countries tracker.",
  },
};

const faqs = [
  {
    question: "How do I mark a country as visited?",
    answer: "Click on any country on the map to open its details panel, then click the 'Visited' button. You can also use the country search dropdown to find and select countries quickly.",
  },
  {
    question: "Is MyMap free to use?",
    answer: "Yes, MyMap is completely free to use with no hidden costs, subscriptions, or premium features. All features are available to everyone, always.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No account is required! MyMap works entirely in your browser using local storage. Your data stays on your device and never leaves your computer.",
  },
  {
    question: "How many countries can I track?",
    answer: "MyMap includes all 195 countries recognized by the United Nations (193 member states plus Vatican City and Palestine). You can track all of them!",
  },
  {
    question: "Can I export my map?",
    answer: "Yes! Click the 'Export' button to download your map as a high-resolution PNG image. You can choose from preset sizes (Print Quality, Social Media, HD, 4K) or set custom dimensions.",
  },
  {
    question: "How do I share my travel map?",
    answer: "Use the 'Share' button to share your map using your device's native sharing functionality. On mobile, this opens the share sheet. On desktop, it copies the map to your clipboard.",
  },
  {
    question: "Can I add notes to countries?",
    answer: "Yes! When you select a country, you can add personal notes, visit dates, and rate your experience from 1 to 5 stars. This helps you remember your travel memories.",
  },
  {
    question: "What are tags and how do I use them?",
    answer: "Tags help you organize countries. You can use predefined tags like 'Want to Visit', 'Lived Here', or 'Favorite', or create your own custom tags with colors and emojis.",
  },
  {
    question: "Is my data private?",
    answer: "Absolutely! All your data is stored locally in your browser's localStorage. We don't collect, store, or share any of your personal information. Your travel data belongs to you and stays on your device.",
  },
  {
    question: "Can I use MyMap on my phone?",
    answer: "Yes! MyMap is fully optimized for mobile devices. It works beautifully on phones, tablets, and desktops with touch-friendly controls and a mobile-optimized interface.",
  },
  {
    question: "What happens if I clear my browser data?",
    answer: "If you clear your browser's localStorage, your MyMap data will be lost. We recommend exporting your map regularly as a backup. You can also export your data before clearing browser data.",
  },
  {
    question: "Can I change the color of visited countries?",
    answer: "Yes! You can customize the color of visited countries using the color picker in the settings. Choose any color that matches your style.",
  },
  {
    question: "How do I search for a country?",
    answer: "Use the search dropdown in the sidebar (or mobile menu). Start typing a country name and select it from the list. The map will automatically zoom to the selected country.",
  },
  {
    question: "Can I track countries I want to visit?",
    answer: "Yes! Use tags to mark countries you want to visit. The 'Want to Visit' tag is perfect for your travel bucket list. You can also create custom tags for different categories.",
  },
  {
    question: "What's the difference between visited and not visited?",
    answer: "Visited countries are marked with your chosen color and can have notes, dates, and ratings. Not visited countries remain in the default color. You can filter and manage both categories.",
  },
  {
    question: "Can I print my map?",
    answer: "Yes! Export your map using the 'Print Quality' preset (3840x2560 pixels) for best results. You can then print it at any print shop or use an online printing service.",
  },
  {
    question: "How do I see my travel statistics?",
    answer: "Your travel statistics are displayed in the stats bar at the top of the page. It shows how many countries you've visited out of 195 total, along with the percentage.",
  },
  {
    question: "Can I use MyMap offline?",
    answer: "Once loaded, MyMap works offline! However, you'll need an internet connection to initially load the app. After that, you can use it offline and your data will sync when you're back online.",
  },
  {
    question: "What browsers are supported?",
    answer: "MyMap works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your browser.",
  },
  {
    question: "How do I reset my map?",
    answer: "You can clear all your data by clearing your browser's localStorage for the site, or by using browser developer tools. Be careful—this action cannot be undone!",
  },
  {
    question: "Can I have multiple maps?",
    answer: "Currently, MyMap stores one map per browser. If you want multiple maps, you can use different browsers or browser profiles. Each will have its own separate data.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-lemon-milk)" }}>
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about MyMap
            </p>
          </div>

          {/* FAQ Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs.map((faq) => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer,
                  },
                })),
              }),
            }}
          />

          {/* FAQ List */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border bg-card space-y-2"
              >
                <h2 className="text-xl font-semibold">{faq.question}</h2>
                <p className="text-muted-foreground leading-7">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <section className="text-center space-y-6 p-8 rounded-lg border bg-muted/50">
            <h2 className="text-2xl font-bold">Still Have Questions?</h2>
            <p className="text-muted-foreground">
              Check out our blog for more detailed guides and travel tips, or explore our features page to learn more about what MyMap can do.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/blog"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Read Blog
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
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/features" className="hover:text-foreground">Features</Link>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
          </nav>
        </div>
      </main>
    </div>
  );
}


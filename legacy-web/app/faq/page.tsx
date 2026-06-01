import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DonationHint } from "@/components/DonationHint";
import { SocialProof } from "@/components/SocialProof";

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
    category: "Getting Started",
    icon: "🚀",
    questions: [
      {
        question: "How do I mark a country as visited?",
        answer: "Click on any country on the map to open its details panel, then click the toggle button to mark it as visited. You can also use the country search dropdown to find and select countries quickly.",
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
        question: "How do I search for a country?",
        answer: "Use the search dropdown in the sidebar (or mobile menu). Start typing a country name and select it from the list. The map will automatically zoom to the selected country.",
      },
    ],
  },
  {
    category: "Features & Usage",
    icon: "✨",
    questions: [
      {
        question: "Can I add notes to countries?",
        answer: "Yes! When you select a country, you can add personal notes, visit dates, and rate your experience from 1 to 5 stars. This helps you remember your travel memories.",
      },
      {
        question: "What are tags and how do I use them?",
        answer: "Tags help you organize countries. You can use predefined tags like 'Want to Visit', 'Lived Here', or 'Favorite', or create your own custom tags with colors and emojis.",
      },
      {
        question: "Can I change the color of visited countries?",
        answer: "Yes! You can customize the color of visited countries using the color picker in the legend. Choose from a palette of beautiful colors that matches your style.",
      },
      {
        question: "Can I track countries I want to visit?",
        answer: "Yes! Use tags to mark countries you want to visit. The 'Want to Visit' tag is perfect for your travel bucket list. You can also create custom tags for different categories.",
      },
      {
        question: "How do I see my travel statistics?",
        answer: "Your travel statistics are displayed in the stats bar at the top of the page. It shows how many countries you've visited out of 195 total, along with the percentage.",
      },
    ],
  },
  {
    category: "Sharing & Export",
    icon: "📤",
    questions: [
      {
        question: "Can I export my map?",
        answer: "Yes! Click the 'Export' button to download your map as a high-resolution PNG image. You can choose from preset sizes (Print Quality, Social Media, HD, 4K) or set custom dimensions.",
      },
      {
        question: "How do I share my travel map?",
        answer: "Use the 'Share' button to share your map using your device's native sharing functionality. On mobile, this opens the share sheet. On desktop, it copies the map to your clipboard. You can also copy shareable links with your map state encoded in the URL.",
      },
      {
        question: "Can I print my map?",
        answer: "Yes! Export your map using the 'Print Quality' preset (3840x2560 pixels) for best results. You can then print it at any print shop or use an online printing service.",
      },
    ],
  },
  {
    category: "Privacy & Data",
    icon: "🔒",
    questions: [
      {
        question: "Is my data private?",
        answer: "Absolutely! All your data is stored locally in your browser's localStorage. We don't collect, store, or share any of your personal information. Your travel data belongs to you and stays on your device.",
      },
      {
        question: "What happens if I clear my browser data?",
        answer: "If you clear your browser's localStorage, your MyMap data will be lost. We recommend exporting your map regularly as a backup. You can also export your data before clearing browser data.",
      },
      {
        question: "How do I reset my map?",
        answer: "You can clear all your data by visiting the 'Manage countries' page and clicking 'Clear All Data', or by clearing your browser's localStorage for the site. Be careful—this action cannot be undone!",
      },
      {
        question: "Can I have multiple maps?",
        answer: "Currently, MyMap stores one map per browser. If you want multiple maps, you can use different browsers or browser profiles. Each will have its own separate data.",
      },
    ],
  },
  {
    category: "Technical",
    icon: "⚙️",
    questions: [
      {
        question: "Is MyMap free to use?",
        answer: "Yes, MyMap is completely free to use with no hidden costs, subscriptions, or premium features. All features are available to everyone, always.",
      },
      {
        question: "Can I use MyMap on my phone?",
        answer: "Yes! MyMap is fully optimized for mobile devices. It works beautifully on phones, tablets, and desktops with touch-friendly controls and a mobile-optimized interface.",
      },
      {
        question: "Can I use MyMap offline?",
        answer: "Once loaded, MyMap works offline! However, you'll need an internet connection to initially load the app. After that, you can use it offline and your data will be saved locally.",
      },
      {
        question: "What browsers are supported?",
        answer: "MyMap works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your browser.",
      },
    ],
  },
];

// Flatten for schema
const allFaqs = faqs.flatMap((category) => category.questions);

export default function FAQPage() {
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
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about MyMap
            </p>
            <div className="flex items-center justify-center pt-2">
              <SocialProof />
            </div>
          </div>

          {/* FAQ Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": allFaqs.map((faq) => ({
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

          {/* FAQ Categories */}
          <div className="space-y-10">
            {faqs.map((category, categoryIndex) => (
              <section key={categoryIndex} className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="text-2xl font-bold">{category.category}</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {category.questions.map((faq, faqIndex) => (
                    <div
                      key={faqIndex}
                      className="p-6 rounded-lg border bg-card hover:border-primary/50 hover:shadow-md transition-all space-y-3"
                    >
                      <h3 className="text-lg font-semibold text-foreground">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground leading-7">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Donation Hint */}
          <DonationHint variant="compact" />

          {/* Still Have Questions */}
          <section className="text-center space-y-6 p-8 rounded-lg border bg-muted/50">
            <h2 className="text-2xl font-bold">Still Have Questions?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check out our blog for more detailed guides and travel tips, or explore our features page to learn more about what MyMap can do.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/blog"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Read Blog
              </Link>
              <Link
                href="/features"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                View Features
              </Link>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Start Tracking
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
              href="/features" 
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Features
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


import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "./posts";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog - Travel Tips, Guides & Inspiration | MyMap",
  description: "Read travel guides, tips, and inspiration for tracking your visited countries. Learn how to plan your travel bucket list and document your journey.",
  openGraph: {
    title: "Blog - Travel Tips, Guides & Inspiration | MyMap",
    description: "Read travel guides, tips, and inspiration for tracking your visited countries.",
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();

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
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Map
            </Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-lemon-milk)" }}>
              Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Travel guides, tips, and inspiration for tracking your journey
            </p>
          </div>

          {/* Blog Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group p-6 rounded-xl border-2 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <time dateTime={post.date} className="font-medium">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </time>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {post.readTime} min read
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors group-hover:underline decoration-2 underline-offset-4"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                    >
                      Read more
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Footer Links */}
          <nav className="flex flex-wrap gap-2 sm:gap-6 justify-center pt-8">
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
              href="/faq"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              FAQ
            </Link>
          </nav>
        </div>
      </main>
    </div>
  );
}


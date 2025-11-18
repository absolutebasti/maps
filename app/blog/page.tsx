import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "./posts";

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
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="p-6 rounded-lg border bg-card hover:border-primary/50 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <time dateTime={post.date}>{post.date}</time>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <h2 className="text-2xl font-bold">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block text-sm font-medium text-primary hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Footer Links */}
          <nav className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground pt-8">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/features" className="hover:text-foreground">Features</Link>
            <Link href="/faq" className="hover:text-foreground">FAQ</Link>
          </nav>
        </div>
      </main>
    </div>
  );
}


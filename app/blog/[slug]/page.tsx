import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getBlogPosts } from "../posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | MyMap Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link 
                href="/blog" 
                className="px-3 py-2 hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] flex items-center justify-center"
              >
                ← Back to Blog
              </Link>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                <span>•</span>
                <span>{post.readTime} min read</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-lemon-milk)" }}>
                {post.title}
              </h1>
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
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.content.split("\n\n").map((paragraph, i) => {
              // Helper function to format text (bold and italic)
              const formatText = (text: string) => {
                return text
                  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\*(.+?)\*/g, "<em>$1</em>");
              };

              // Handle headings
              if (paragraph.startsWith("# ")) {
                return <h1 key={i} className="text-4xl font-bold mt-8 mb-4">{paragraph.replace(/^# /, "")}</h1>;
              }
              if (paragraph.startsWith("## ")) {
                return <h2 key={i} className="text-3xl font-bold mt-6 mb-3">{paragraph.replace(/^## /, "")}</h2>;
              }
              if (paragraph.startsWith("### ")) {
                return <h3 key={i} className="text-2xl font-semibold mt-4 mb-2">{paragraph.replace(/^### /, "")}</h3>;
              }

              // Handle bulleted lists - check if it's a list block
              const isBulletList = paragraph.trim().split("\n").every(line => line.trim().startsWith("- ") || line.trim() === "");
              if (isBulletList && paragraph.trim().split("\n").some(line => line.trim().startsWith("- "))) {
                const items = paragraph
                  .split("\n")
                  .map(line => line.trim())
                  .filter(line => line.startsWith("- "))
                  .map(line => line.replace(/^- /, ""));
                return (
                  <ul key={i} className="list-disc list-inside space-y-2 my-4 ml-4">
                    {items.map((item, j) => (
                      <li key={j} className="mb-1" dangerouslySetInnerHTML={{ __html: formatText(item) }} />
                    ))}
                  </ul>
                );
              }

              // Handle numbered lists - check if it's a numbered list block
              const isNumberedList = paragraph.trim().split("\n").every(line => /^\d+\./.test(line.trim()) || line.trim() === "");
              if (isNumberedList && paragraph.trim().split("\n").some(line => /^\d+\./.test(line.trim()))) {
                const items = paragraph
                  .split("\n")
                  .map(line => line.trim())
                  .filter(line => /^\d+\./.test(line))
                  .map(line => line.replace(/^\d+\.\s*/, ""));
                return (
                  <ol key={i} className="list-decimal list-inside space-y-2 my-4 ml-4">
                    {items.map((item, j) => (
                      <li key={j} className="mb-1" dangerouslySetInnerHTML={{ __html: formatText(item) }} />
                    ))}
                  </ol>
                );
              }

              // Regular paragraphs
              return <p key={i} className="my-4 leading-7" dangerouslySetInnerHTML={{ __html: formatText(paragraph) }} />;
            })}
          </div>

          {/* Footer */}
          <footer className="pt-8 border-t space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">Ready to Start Tracking Your Journey?</h2>
              <p className="text-muted-foreground">
                Use MyMap to track the countries you've visited and visualize your travel progress.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Start Tracking Free
              </Link>
            </div>

            <nav className="flex flex-wrap gap-2 sm:gap-6 justify-center pt-8">
              <Link 
                href="/" 
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                Home
              </Link>
              <Link 
                href="/blog" 
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                Blog
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
          </footer>
        </div>
      </article>
    </div>
  );
}


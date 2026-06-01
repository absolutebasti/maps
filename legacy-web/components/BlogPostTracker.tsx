"use client";

import { useEffect } from "react";
import { analytics } from "./../lib/analytics";

type Props = {
  slug: string;
  title: string;
};

export function BlogPostTracker({ slug, title }: Props) {
  useEffect(() => {
    // Track blog post view when component mounts
    analytics.blogPostViewed(slug, title);
  }, [slug, title]);

  return null;
}


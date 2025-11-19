// Google Analytics 4 event tracking
// This file provides a type-safe interface for tracking events

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

type EventName =
  | "country_marked_visited"
  | "country_unmarked"
  | "map_exported"
  | "share_clicked"
  | "blog_post_viewed"
  | "onboarding_completed"
  | "onboarding_skipped"
  | "country_note_added"
  | "country_rated"
  | "tag_added"
  | "search_used"
  | "feature_page_viewed"
  | "about_page_viewed"
  | "faq_page_viewed";

type EventParams = {
  country_name?: string;
  country_id?: string;
  export_format?: string;
  export_width?: number;
  export_height?: number;
  blog_post_slug?: string;
  blog_post_title?: string;
  tag_name?: string;
  rating?: number;
  search_query?: string;
  page_path?: string;
};

/**
 * Track a custom event in Google Analytics 4
 */
export function trackEvent(eventName: EventName, params?: EventParams) {
  // Only track in production or if GA4 is configured
  if (typeof window === "undefined" || !window.gtag) {
    // In development, log to console for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", eventName, params);
    }
    return;
  }

  try {
    window.gtag("event", eventName, params);
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window === "undefined" || !window.gtag) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] Page View", path, title);
    }
    return;
  }

  try {
    window.gtag("config", process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "", {
      page_path: path,
      page_title: title,
    });
  } catch (error) {
    console.error("Analytics page view error:", error);
  }
}

// Convenience functions for specific events
export const analytics = {
  countryMarkedVisited: (countryName: string, countryId: string) => {
    trackEvent("country_marked_visited", {
      country_name: countryName,
      country_id: countryId,
    });
  },

  countryUnmarked: (countryName: string, countryId: string) => {
    trackEvent("country_unmarked", {
      country_name: countryName,
      country_id: countryId,
    });
  },

  mapExported: (format: string, width: number, height: number) => {
    trackEvent("map_exported", {
      export_format: format,
      export_width: width,
      export_height: height,
    });
  },

  shareClicked: () => {
    trackEvent("share_clicked");
  },

  blogPostViewed: (slug: string, title: string) => {
    trackEvent("blog_post_viewed", {
      blog_post_slug: slug,
      blog_post_title: title,
    });
  },

  onboardingCompleted: () => {
    trackEvent("onboarding_completed");
  },

  onboardingSkipped: () => {
    trackEvent("onboarding_skipped");
  },

  countryNoteAdded: (countryName: string, countryId: string) => {
    trackEvent("country_note_added", {
      country_name: countryName,
      country_id: countryId,
    });
  },

  countryRated: (countryName: string, countryId: string, rating: number) => {
    trackEvent("country_rated", {
      country_name: countryName,
      country_id: countryId,
      rating: rating,
    });
  },

  tagAdded: (tagName: string, countryName: string, countryId: string) => {
    trackEvent("tag_added", {
      tag_name: tagName,
      country_name: countryName,
      country_id: countryId,
    });
  },

  searchUsed: (query: string) => {
    trackEvent("search_used", {
      search_query: query,
    });
  },

  pageView: (path: string, title?: string) => {
    trackPageView(path, title);
  },
};


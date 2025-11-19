/**
 * Client-side utilities for tracking stats
 */

/**
 * Get or create a session ID (stored in sessionStorage)
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('mymap_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('mymap_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Hash IP address for privacy (one-way hash)
 */
function hashIP(ip: string): string {
  // Simple hash function (in production, use crypto.subtle for better security)
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Record a page visit
 */
export async function recordVisit(pagePath: string = '/'): Promise<void> {
  try {
    const sessionId = getSessionId();
    
    // Get IP hash (will be done server-side for security)
    const response = await fetch('/api/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        page_path: pagePath,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      }),
    });

    if (!response.ok) {
      console.warn('Failed to record visit');
    }
  } catch (error) {
    // Silently fail - don't break the app if tracking fails
    console.warn('Error recording visit:', error);
  }
}

/**
 * Record a user action event
 */
export async function recordEvent(
  event: 'country_marked' | 'map_exported' | 'share_clicked'
): Promise<void> {
  try {
    const response = await fetch('/api/stats/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event }),
    });

    if (!response.ok) {
      console.warn('Failed to record event');
    }
  } catch (error) {
    // Silently fail - don't break the app if tracking fails
    console.warn('Error recording event:', error);
  }
}

/**
 * Get today's stats
 */
export async function getTodayStats(): Promise<{
  today: number;
  totalCountries: number;
  totalExports: number;
  totalShares: number;
} | null> {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return {
      today: data.visits_count || 0,
      totalCountries: data.countries_marked || 0,
      totalExports: data.maps_exported || 0,
      totalShares: data.shares_clicked || 0,
    };
  } catch (error) {
    console.warn('Error fetching stats:', error);
    return null;
  }
}


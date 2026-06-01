"use client";

import { useEffect, useState } from "react";
import { getTodayStats } from "@/lib/supabase/stats";

type Stats = {
  today: number;
  totalCountries: number;
  totalExports: number;
  totalShares: number;
};

export function SocialProof() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(false);
      const data = await getTodayStats();
      if (data) {
        setStats(data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.warn('Failed to fetch stats:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch stats on mount
    fetchStats();

    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Don't show anything if there's an error or no stats
  if (error || !stats) {
    return null;
  }

  // Format number with commas
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      {isLoading ? (
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
      ) : (
        <>
          <span className="text-primary font-semibold">{formatNumber(stats.today)}</span>
          <span>travelers today</span>
        </>
      )}
    </div>
  );
}


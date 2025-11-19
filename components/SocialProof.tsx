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
    <div className="bg-muted/30 border rounded-lg p-4 sm:p-6 text-center space-y-3">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm">Loading stats...</span>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <p className="text-lg sm:text-xl font-semibold text-foreground">
              <span className="text-primary font-bold">{formatNumber(stats.today)}</span>{" "}
              travelers using MyMap today
            </p>
            {(stats.totalCountries > 0 || stats.totalExports > 0 || stats.totalShares > 0) && (
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                {stats.totalCountries > 0 && (
                  <span>
                    <span className="font-medium text-foreground">{formatNumber(stats.totalCountries)}</span> countries marked
                  </span>
                )}
                {stats.totalExports > 0 && (
                  <span>
                    <span className="font-medium text-foreground">{formatNumber(stats.totalExports)}</span> maps exported
                  </span>
                )}
                {stats.totalShares > 0 && (
                  <span>
                    <span className="font-medium text-foreground">{formatNumber(stats.totalShares)}</span> shares
                  </span>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}


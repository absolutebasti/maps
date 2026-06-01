"use client";

import { useAppStore } from "../lib/state/store";
import { useAuth } from "./AuthProvider";

type MobileBottomNavProps = {
    onMenuClick: () => void;
    onSearchClick: () => void;
    onAccountClick?: () => void;
};

export function MobileBottomNav({ onMenuClick, onSearchClick, onAccountClick }: MobileBottomNavProps) {
    const countriesById = useAppStore((s) => s.countriesById);
    const visitedCount = Object.values(countriesById).filter((c) => c.visited).length;
    const { user, syncStatus } = useAuth();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t sm:hidden safe-area-inset-bottom">
            <div className="flex items-center justify-around h-14 max-w-md mx-auto">
                {/* Map */}
                <button
                    className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-primary"
                    aria-label="Map view"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                    <span className="text-[11px] font-medium">Map</span>
                </button>

                {/* Search */}
                <button
                    onClick={onSearchClick}
                    className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Search countries"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <span className="text-[11px] font-medium">Search</span>
                </button>

                {/* Stats */}
                <button
                    onClick={onMenuClick}
                    className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-muted-foreground hover:text-primary transition-colors relative"
                    aria-label={`Your stats: ${visitedCount} countries visited`}
                >
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 3v18h18" />
                            <path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                        {visitedCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                                {visitedCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[11px] font-medium">Stats</span>
                </button>

                {/* Account */}
                <button
                    onClick={onAccountClick || onMenuClick}
                    className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-muted-foreground hover:text-primary transition-colors relative"
                    aria-label={user ? "Your account" : "Sign in"}
                >
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        {user && (
                            <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${syncStatus === "synced" ? "bg-green-500" :
                                    syncStatus === "syncing" ? "bg-blue-500 animate-pulse" :
                                        syncStatus === "error" ? "bg-amber-500" : "bg-gray-400"
                                }`} />
                        )}
                    </div>
                    <span className="text-[11px] font-medium">{user ? "You" : "Sign In"}</span>
                </button>

                {/* More */}
                <button
                    onClick={onMenuClick}
                    className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-muted-foreground hover:text-primary transition-colors"
                    aria-label="More options"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                    <span className="text-[11px] font-medium">More</span>
                </button>
            </div>
        </nav>
    );
}

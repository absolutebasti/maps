"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "../lib/supabase/auth";
import type { User } from "@supabase/supabase-js";

type UserMenuProps = {
    user: User;
    onSignOut: () => void;
    syncStatus: "synced" | "syncing" | "error" | "idle";
};

export function UserMenu({ user, onSignOut, syncStatus }: UserMenuProps) {
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        setLoading(true);
        const { error } = await signOut();
        if (!error) {
            onSignOut();
        }
        setLoading(false);
    };

    const getSyncInfo = () => {
        switch (syncStatus) {
            case "syncing":
                return { icon: "🔄", text: "Saving your changes...", color: "text-blue-600" };
            case "synced":
                return { icon: "☁️", text: "All changes saved", color: "text-green-600" };
            case "error":
                return { icon: "⚠️", text: "Sync issue - your data is safe locally", color: "text-amber-600" };
            default:
                return { icon: "☁️", text: "Connected", color: "text-muted-foreground" };
        }
    };

    const syncInfo = getSyncInfo();
    const displayName = user.email?.split("@")[0] || "Traveler";

    return (
        <div className="flex items-center gap-2 sm:gap-3">
            {/* Sync status with tooltip */}
            <div
                className={`hidden sm:flex items-center gap-2 text-sm ${syncInfo.color}`}
                title={syncInfo.text}
            >
                <span className={syncStatus === "syncing" ? "animate-spin" : ""}>
                    {syncInfo.icon}
                </span>
                <span className="truncate max-w-[120px] text-muted-foreground" title={user.email || ""}>
                    {displayName}
                </span>
            </div>

            {/* Sign out button */}
            <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                disabled={loading}
                className="text-xs sm:text-sm gap-1.5"
            >
                {loading ? (
                    <span className="animate-pulse">...</span>
                ) : (
                    <>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="hidden sm:inline"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Sign Out</span>
                    </>
                )}
            </Button>
        </div>
    );
}

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

    const getSyncIcon = () => {
        switch (syncStatus) {
            case "syncing":
                return "🔄";
            case "synced":
                return "☁️";
            case "error":
                return "⚠️";
            default:
                return "☁️";
        }
    };

    const getSyncText = () => {
        switch (syncStatus) {
            case "syncing":
                return "Syncing...";
            case "synced":
                return "Synced";
            case "error":
                return "Sync error";
            default:
                return "";
        }
    };

    return (
        <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span title={getSyncText()}>{getSyncIcon()}</span>
                <span className="truncate max-w-[150px]" title={user.email || ""}>
                    {user.email}
                </span>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                disabled={loading}
                className="text-xs"
            >
                {loading ? "..." : "Logout"}
            </Button>
        </div>
    );
}

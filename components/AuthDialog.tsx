"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { signIn, signUp } from "../lib/supabase/auth";

type AuthDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = mode === "login"
                ? await signIn(email, password)
                : await signUp(email, password);

            if (result.error) {
                setError(result.error.message);
            } else if (result.user) {
                if (mode === "signup" && !result.session) {
                    // Email confirmation required
                    setError("Check your email to confirm your account!");
                } else {
                    onSuccess();
                    onOpenChange(false);
                    setEmail("");
                    setPassword("");
                }
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === "login" ? "signup" : "login");
        setError("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {mode === "login" ? "Welcome Back" : "Create Account"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "login"
                            ? "Sign in to sync your visited countries across devices"
                            : "Create an account to save your travel map"
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-md border-2 border-gray-300 bg-white text-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-md border-2 border-gray-300 bg-white text-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading
                            ? "Loading..."
                            : mode === "login"
                                ? "Sign In"
                                : "Create Account"
                        }
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    {mode === "login" ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <button
                                onClick={toggleMode}
                                className="text-primary hover:underline font-medium"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={toggleMode}
                                className="text-primary hover:underline font-medium"
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
